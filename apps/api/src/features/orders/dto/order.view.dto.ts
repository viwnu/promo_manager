import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsMongoId, IsNumber, IsString } from 'class-validator';

import { Order } from '../schema';
import { SerializedView } from '@app/serializer/interface';

export class OrderViewDto extends OmitType(Order, ['userId']) implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Order id' })
  @IsMongoId()
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsMongoId()
  @Transform(({ value }) => value.toString())
  @Expose()
  userId!: string;

  @ApiProperty({ type: 'number', example: 199.99, description: 'Order amount' })
  @IsNumber()
  @Expose()
  amount!: number;

  @ApiPropertyOptional({ type: 'string', example: 'SUMMER2026', description: 'Applied promo code', required: false })
  @IsString()
  @Expose()
  promoCode?: string;

  @ApiProperty({ type: 'string', format: 'date-time', example: '2026-02-08T10:00:00.000Z', description: 'Created at' })
  @IsDate()
  @Expose()
  createdAt!: Date;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: OrderViewDto,
  };
}
