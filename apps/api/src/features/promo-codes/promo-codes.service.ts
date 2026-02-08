import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';

import { PromoCode } from './schema';
import { CreatePromoCodeDto, PromoCodeViewDto, UpdatePromoCodeDto } from './dto';

@Injectable()
export class PromoCodesService {
  constructor(@InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCode>) {}

  private toView(doc: Record<string, any>): PromoCodeViewDto {
    const plain = { ...doc, id: doc.id ?? doc._id?.toString?.() ?? doc._id };
    return plainToInstance(PromoCodeViewDto, plain, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async create(dto: CreatePromoCodeDto): Promise<PromoCodeViewDto> {
    const existing = await this.promoCodeModel.findOne({ code: dto.code }).lean();
    if (existing) throw new ForbiddenException('Promo code already exist');

    const created = await new this.promoCodeModel(dto).save();
    return this.toView(created.toObject());
  }

  async findAll(): Promise<PromoCodeViewDto[]> {
    const promoCodes = await this.promoCodeModel.find().lean();
    return promoCodes.map((promoCode) => this.toView(promoCode));
  }

  async findOne(id: string): Promise<PromoCodeViewDto> {
    const promoCode = await this.promoCodeModel.findById(id).lean();
    if (!promoCode) throw new NotFoundException('Promo code not found');

    return this.toView(promoCode);
  }

  async update(id: string, dto: UpdatePromoCodeDto): Promise<PromoCodeViewDto> {
    if (dto.code) {
      const existing = await this.promoCodeModel.findOne({ code: dto.code, _id: { $ne: id } }).lean();
      if (existing) throw new ForbiddenException('Promo code already exist');
    }

    const updated = await this.promoCodeModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!updated) throw new NotFoundException('Promo code not found');

    return this.toView(updated);
  }

  async disable(id: string): Promise<PromoCodeViewDto> {
    const updated = await this.promoCodeModel.findByIdAndUpdate(id, { active: false }, { new: true }).lean();
    if (!updated) throw new NotFoundException('Promo code not found');

    return this.toView(updated);
  }
}
