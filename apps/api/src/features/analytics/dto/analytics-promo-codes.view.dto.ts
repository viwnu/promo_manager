import { ApiProperty } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { SerializedView } from '@app/serializer/interface';

export class AnalyticsPromoCodeAggregatedStatsViewDto implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsString()
  @Expose()
  promo_code_id!: string;

  @ApiProperty({ type: 'string', example: 'SUMMER2026', description: 'Promo code' })
  @IsString()
  @Expose()
  code!: string;

  @ApiProperty({ type: 'number', example: 12, description: 'Uses count' })
  @IsNumber()
  @Expose()
  uses_count!: number;

  @ApiProperty({ type: 'number', example: 8, description: 'Unique users' })
  @IsNumber()
  @Expose()
  unique_users!: number;

  @ApiProperty({ type: 'string', example: '999.99', description: 'Revenue sum' })
  @IsString()
  @Expose()
  revenue_sum!: string;

  @ApiProperty({ type: 'string', example: '50.00', description: 'Order amount min' })
  @IsString()
  @Expose()
  order_amount_min!: string;

  @ApiProperty({ type: 'string', example: '300.00', description: 'Order amount max' })
  @IsString()
  @Expose()
  order_amount_max!: string;

  @ApiProperty({ type: 'string', example: '120.00', description: 'Order amount avg' })
  @IsString()
  @Expose()
  order_amount_avg!: string;

  @ApiProperty({ type: 'string', example: '25.00', description: 'Discount sum' })
  @IsString()
  @Expose()
  discount_sum!: string;

  @ApiProperty({ type: 'string', example: '5.00', description: 'Discount min' })
  @IsString()
  @Expose()
  discount_min!: string;

  @ApiProperty({ type: 'string', example: '40.00', description: 'Discount max' })
  @IsString()
  @Expose()
  discount_max!: string;

  @ApiProperty({ type: 'string', example: '15.00', description: 'Discount avg' })
  @IsString()
  @Expose()
  discount_avg!: string;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsPromoCodeAggregatedStatsViewDto,
  };
}

export class AnalyticsPromoCodesAggregatedStatsViewDto implements SerializedView {
  @ApiProperty({ type: [AnalyticsPromoCodeAggregatedStatsViewDto], description: 'Items' })
  @IsArray()
  @Type(() => AnalyticsPromoCodeAggregatedStatsViewDto)
  @Expose()
  items!: AnalyticsPromoCodeAggregatedStatsViewDto[];

  @ApiProperty({ type: 'number', example: 120, description: 'Total items count' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose()
  total!: number;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsPromoCodesAggregatedStatsViewDto,
  };
}
