import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Decimal from 'decimal.js';

import { PromoCode, PromoCodeDocument } from '../promo-codes/schema';
import { Order, OrderDocument, PromoCodeUsage, PromoCodeUsageDocument } from './schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(PromoCodeUsage.name) private readonly promoCodeUsageModel: Model<PromoCodeUsageDocument>,
  ) {}

  async applyPromoCode(orderId: string, userId: string, code: string): Promise<PromoCodeUsageDocument> {
    const order = await this.getOrderForUser(orderId, userId);
    const promoCode = await this.getActivePromoCode(code);
    await this.ensurePromoCodeLimits(promoCode, userId);

    const discountAmount = this.calculateDiscountAmount(order.amount, promoCode.discount);
    const usage = await this.createPromoCodeUsage(order, promoCode, discountAmount);

    order.promoCode = promoCode.code;
    await order.save();

    return usage;
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return await this.orderModel.find({ userId }).exec();
  }

  private async getOrderForUser(orderId: string, userId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findOne({ _id: orderId, userId }).exec();
    if (!order) throw new NotFoundException('Order not found');
    if (order.promoCode) throw new ForbiddenException('Promo code already applied');
    return order;
  }

  private async getActivePromoCode(code: string): Promise<PromoCodeDocument> {
    const promoCode = await this.promoCodeModel.findOne({ code }).exec();
    if (!promoCode) throw new NotFoundException('Promo code not found');
    if (!promoCode.active) throw new ForbiddenException('Promo code is inactive');
    this.ensurePromoCodeValidityPeriod(promoCode);
    return promoCode;
  }

  private ensurePromoCodeValidityPeriod(promoCode: PromoCodeDocument): void {
    const now = new Date();
    if (promoCode.validityPeriod?.start && promoCode.validityPeriod.start > now) {
      throw new ForbiddenException('Promo code is not active yet');
    }
    if (promoCode.validityPeriod?.end && promoCode.validityPeriod.end < now) {
      throw new ForbiddenException('Promo code has expired');
    }
  }

  private async ensurePromoCodeLimits(promoCode: PromoCodeDocument, userId: string): Promise<void> {
    const [overallUsed, perUserUsed] = await Promise.all([
      this.promoCodeUsageModel.countDocuments({ promoCodeId: promoCode._id }),
      this.promoCodeUsageModel.countDocuments({
        promoCodeId: promoCode._id,
        userId: new Types.ObjectId(userId),
      }),
    ]);

    if (promoCode.limit?.overall !== undefined && overallUsed >= promoCode.limit.overall) {
      throw new ForbiddenException('Promo code usage limit reached');
    }
    if (promoCode.limit?.perUser !== undefined && perUserUsed >= promoCode.limit.perUser) {
      throw new ForbiddenException('Promo code usage limit per user reached');
    }
  }

  private calculateDiscountAmount(orderAmount: number, discountPercent: number): number {
    return new Decimal(orderAmount).mul(discountPercent).div(100).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber();
  }

  private async createPromoCodeUsage(
    order: OrderDocument,
    promoCode: PromoCodeDocument,
    discountAmount: number,
  ): Promise<PromoCodeUsageDocument> {
    return new this.promoCodeUsageModel({
      promoCodeId: promoCode._id,
      userId: order.userId,
      orderId: order._id,
      discountAmount,
    }).save();
  }
}
