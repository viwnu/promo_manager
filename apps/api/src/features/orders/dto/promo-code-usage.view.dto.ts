import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsDate, IsMongoId, IsNumber } from 'class-validator';

import { PromoCodeUsage } from '../schema';
import { SerializedView } from '@app/serializer/interface';

export class PromoCodeUsageViewDto
  extends OmitType(PromoCodeUsage, ['promoCodeId', 'userId', 'orderId'])
  implements SerializedView
{
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Usage id' })
  @IsMongoId()
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsMongoId()
  @Expose()
  promoCodeId!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsMongoId()
  @Expose()
  userId!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Order id' })
  @IsMongoId()
  @Expose()
  orderId!: string;

  @ApiProperty({ type: 'number', example: 125.5, description: 'Calculated discount amount' })
  @IsNumber()
  @Expose()
  discountAmount!: number;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2026-02-08T10:00:00.000Z', description: 'Usage date' })
  @IsDate()
  @Expose()
  createdAt!: Date;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: PromoCodeUsageViewDto,
  };
}
