import { ApiProperty } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

import { SerializedView } from '@app/serializer/interface';

export class AnalyticsPromoCodeUsageHistoryItemViewDto implements SerializedView {
  @ApiProperty({ type: 'string', format: 'date-time', example: '2026-02-08T10:00:00.000Z', description: 'Used at' })
  @IsString()
  @Expose()
  used_at!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsString()
  @Expose()
  promo_code_id!: string;

  @ApiProperty({ type: 'string', example: 'SUMMER2026', description: 'Promo code' })
  @IsString()
  @Expose()
  code!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsString()
  @Expose()
  user_id!: string;

  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Order id' })
  @IsString()
  @Expose()
  order_id!: string;

  @ApiProperty({ type: 'string', example: 'user@email.com', description: 'Email' })
  @IsString()
  @Expose()
  email!: string;

  @ApiProperty({ type: 'string', example: 'John', description: 'Name' })
  @IsString()
  @Expose()
  name!: string;

  @ApiProperty({ type: 'string', example: '+12025550123', description: 'Phone' })
  @IsString()
  @Expose()
  phone!: string;

  @ApiProperty({ type: 'string', example: '199.99', description: 'Order amount' })
  @IsString()
  @Expose()
  order_amount!: string;

  @ApiProperty({ type: 'string', example: '10.00', description: 'Discount amount' })
  @IsString()
  @Expose()
  discount_amount!: string;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsPromoCodeUsageHistoryItemViewDto,
  };
}

export class AnalyticsPromoCodeUsageHistoryViewDto implements SerializedView {
  @ApiProperty({ type: [AnalyticsPromoCodeUsageHistoryItemViewDto], description: 'Items' })
  @IsArray()
  @Type(() => AnalyticsPromoCodeUsageHistoryItemViewDto)
  @Expose()
  items!: AnalyticsPromoCodeUsageHistoryItemViewDto[];

  @ApiProperty({ type: 'number', example: 120, description: 'Total items count' })
  @Transform(({ value }) => Number(value))
  @Expose()
  total!: number;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsPromoCodeUsageHistoryViewDto,
  };
}
