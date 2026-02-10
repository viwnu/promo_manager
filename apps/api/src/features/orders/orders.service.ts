import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import Decimal from 'decimal.js';
import { EventBus } from '@nestjs/cqrs';

import { PromoCode, PromoCodeDocument } from '../promo-codes/schema';
import { Order, OrderDocument, PromoCodeUsage, PromoCodeUsageDocument } from './schema';
import { User, UserDocument } from '../users/schema';
import { PromoCodeAppliedEvent } from '../../events';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(PromoCodeUsage.name) private readonly promoCodeUsageModel: Model<PromoCodeUsageDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: Connection,
    private readonly eventBus: EventBus,
  ) {}

  async applyPromoCode(orderId: string, userId: string, code: string): Promise<PromoCodeUsageDocument> {
    let eventPayload: PromoCodeAppliedEvent | null = null;

    const usage = await this.transaction(async (session) => {
      const order = await this.getOrderForUser(orderId, userId, session);
      const promoCode = await this.getActivePromoCode(code, session);
      await this.ensurePromoCodeLimits(promoCode, userId, session);

      const discountAmount = this.calculateDiscountAmount(order.amount, promoCode.discount);
      const createdUsage = await this.createPromoCodeUsage(order, promoCode, discountAmount, session);

      order.promoCode = promoCode.code;
      await order.save({ session });

      const user = await this.userModel.findById(order.userId).populate('userIdentity').session(session).lean();
      eventPayload = new PromoCodeAppliedEvent({
        usedAt: createdUsage.createdAt ?? new Date(),
        promoCodeId: promoCode.id ?? promoCode._id?.toString?.(),
        code: promoCode.code,
        userId: order.userId?.toString?.() ?? '',
        orderId: order.id ?? order._id?.toString?.(),
        email: (user as any)?.userIdentity?.email ?? '',
        name: user?.name ?? '',
        phone: user?.phone ?? '',
        orderAmount: order.amount ?? 0,
        discountAmount,
      });

      return createdUsage;
    });

    if (eventPayload) {
      this.eventBus.publish(eventPayload);
    }

    return usage;
  }

  async getUserOrders(userId: string): Promise<OrderDocument[]> {
    return await this.orderModel.find({ userId }).exec();
  }

  private async getOrderForUser(orderId: string, userId: string, session?: ClientSession): Promise<OrderDocument> {
    const query = this.orderModel.findOne({ _id: orderId, userId });
    if (session) query.session(session);
    const order = await query.exec();
    if (!order) throw new NotFoundException('Order not found');
    if (order.promoCode) throw new ForbiddenException('Promo code already applied');
    return order;
  }

  private async getActivePromoCode(code: string, session?: ClientSession): Promise<PromoCodeDocument> {
    const query = this.promoCodeModel.findOne({ code });
    if (session) query.session(session);
    const promoCode = await query.exec();
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

  private async ensurePromoCodeLimits(promoCode: PromoCodeDocument, userId: string, session?: ClientSession): Promise<void> {
    const overallQuery = this.promoCodeUsageModel.countDocuments({ promoCodeId: promoCode._id });
    const perUserQuery = this.promoCodeUsageModel.countDocuments({
      promoCodeId: promoCode._id,
      userId: new Types.ObjectId(userId),
    });
    if (session) {
      overallQuery.session(session);
      perUserQuery.session(session);
    }
    const [overallUsed, perUserUsed] = await Promise.all([overallQuery, perUserQuery]);

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
    session?: ClientSession,
  ): Promise<PromoCodeUsageDocument> {
    return new this.promoCodeUsageModel({
      promoCodeId: promoCode._id,
      userId: order.userId,
      orderId: order._id,
      discountAmount,
    }).save({ session });
  }

  private async transaction<T>(callback: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof HttpException) throw error;
      throw new HttpException('Please try Again later', 429);
    } finally {
      session.endSession();
    }
  }
}
