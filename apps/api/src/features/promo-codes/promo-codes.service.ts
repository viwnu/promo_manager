import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventBus } from '@nestjs/cqrs';

import { PromoCode } from './schema';
import { CreatePromoCodeDto, PromoCodeViewDto, UpdatePromoCodeDto } from './dto';
import { PromoCodeCreatedEvent, PromoCodeUpdatedEvent } from '../../events';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCode>,
    private readonly eventBus: EventBus,
  ) {}

  async create(dto: CreatePromoCodeDto): Promise<PromoCodeViewDto> {
    const existing = await this.promoCodeModel.findOne({ code: dto.code }).lean();
    if (existing) throw new ForbiddenException('Promo code already exist');

    const created = await new this.promoCodeModel(dto).save();
    this.eventBus.publish(
      new PromoCodeCreatedEvent({
        id: created.id ?? created._id?.toString?.(),
        code: created.code,
        active: created.active,
        createdAt: (created as any).createdAt,
        updatedAt: (created as any).updatedAt,
      }),
    );
    return created;
  }

  async findAll(): Promise<PromoCodeViewDto[]> {
    const promoCodes = await this.promoCodeModel.find().exec();
    return promoCodes;
  }

  async findOne(id: string): Promise<PromoCodeViewDto> {
    const promoCode = await this.promoCodeModel.findById(id).exec();
    if (!promoCode) throw new NotFoundException('Promo code not found');

    return promoCode;
  }

  async update(id: string, dto: UpdatePromoCodeDto): Promise<PromoCodeViewDto> {
    if (dto.code) {
      const existing = await this.promoCodeModel.findOne({ code: dto.code, _id: { $ne: id } }).lean();
      if (existing) throw new ForbiddenException('Promo code already exist');
    }

    const updated = await this.promoCodeModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException('Promo code not found');

    this.eventBus.publish(
      new PromoCodeUpdatedEvent({
        id: updated.id ?? updated._id?.toString?.(),
        code: updated.code,
        active: updated.active,
        createdAt: (updated as any).createdAt,
        updatedAt: (updated as any).updatedAt,
      }),
    );
    return updated;
  }

  async disable(id: string): Promise<PromoCodeViewDto> {
    const updated = await this.promoCodeModel.findByIdAndUpdate(id, { active: false }, { new: true }).exec();
    if (!updated) throw new NotFoundException('Promo code not found');

    this.eventBus.publish(
      new PromoCodeUpdatedEvent({
        id: updated.id ?? updated._id?.toString?.(),
        code: updated.code,
        active: updated.active,
        createdAt: (updated as any).createdAt,
        updatedAt: (updated as any).updatedAt,
      }),
    );
    return updated;
  }
}
