import { ApiProperty } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { ANALYTICS_FIELDS, USER_FIELD_MAP, USER_IDENTITY_FIELD_MAP } from '../initialization/queries/analytics-users.query';
import { SerializedView } from '@app/serializer/interface';

export class AnalyticsUserAggregatedStatsViewDto implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsString()
  @Expose()
  [USER_FIELD_MAP.id.key]!: string;

  @ApiProperty({ type: 'string', example: 'user@email.com', description: 'Email' })
  @IsString()
  @Expose()
  [USER_IDENTITY_FIELD_MAP.email.key]!: string;

  @ApiProperty({ type: 'string', example: 'John', description: 'Name' })
  @IsString()
  @Expose()
  [USER_FIELD_MAP.name.key]!: string;

  @ApiProperty({ type: 'string', example: '+12025550123', description: 'Phone' })
  @IsString()
  @Expose()
  [USER_FIELD_MAP.phone.key]!: string;

  @ApiProperty({ type: 'number', example: 5, description: 'Orders count' })
  @IsNumber()
  @Expose()
  [ANALYTICS_FIELDS.ordersCount.key]!: number;

  @ApiProperty({ type: 'string', example: '199.99', description: 'Orders amount sum' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.ordersAmountSum.key]!: string;

  @ApiProperty({ type: 'string', example: '10.00', description: 'Orders amount min' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.ordersAmountMin.key]!: string;

  @ApiProperty({ type: 'string', example: '500.00', description: 'Orders amount max' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.ordersAmountMax.key]!: string;

  @ApiProperty({ type: 'string', example: '120.50', description: 'Orders amount avg' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.ordersAmountAvg.key]!: string;

  @ApiProperty({ type: 'number', example: 2, description: 'Promo codes used' })
  @IsNumber()
  @Expose()
  [ANALYTICS_FIELDS.promoCodesUsed.key]!: number;

  @ApiProperty({ type: 'number', example: 2, description: 'Unique promo codes used' })
  @IsNumber()
  @Expose()
  [ANALYTICS_FIELDS.promoCodesUnique.key]!: number;

  @ApiProperty({ type: 'string', example: '15.00', description: 'Discount sum' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.discountSum.key]!: string;

  @ApiProperty({ type: 'string', example: '5.00', description: 'Discount min' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.discountMin.key]!: string;

  @ApiProperty({ type: 'string', example: '20.00', description: 'Discount max' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.discountMax.key]!: string;

  @ApiProperty({ type: 'string', example: '10.00', description: 'Discount avg' })
  @IsString()
  @Expose()
  [ANALYTICS_FIELDS.discountAvg.key]!: string;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsUserAggregatedStatsViewDto,
  };
}

export class AnalyticsUsersAggregatedStatsViewDto implements SerializedView {
  @ApiProperty({ type: [AnalyticsUserAggregatedStatsViewDto], description: 'Items' })
  @IsArray()
  @Type(() => AnalyticsUserAggregatedStatsViewDto)
  @Expose()
  items!: AnalyticsUserAggregatedStatsViewDto[];

  @ApiProperty({ type: 'number', example: 120, description: 'Total items count' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Expose()
  total!: number;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: AnalyticsUsersAggregatedStatsViewDto,
  };
}
