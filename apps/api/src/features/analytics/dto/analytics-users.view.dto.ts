import { ApiProperty } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { SerializedView } from '@app/serializer/interface';

export class AnalyticsUserAggregatedStatsViewDto implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsString()
  @Expose()
  user_id!: string;

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

  @ApiProperty({ type: 'number', example: 5, description: 'Orders count' })
  @IsNumber()
  @Expose()
  orders_count!: number;

  @ApiProperty({ type: 'string', example: '199.99', description: 'Orders amount sum' })
  @IsString()
  @Expose()
  orders_amount_sum!: string;

  @ApiProperty({ type: 'string', example: '10.00', description: 'Orders amount min' })
  @IsString()
  @Expose()
  orders_amount_min!: string;

  @ApiProperty({ type: 'string', example: '500.00', description: 'Orders amount max' })
  @IsString()
  @Expose()
  orders_amount_max!: string;

  @ApiProperty({ type: 'string', example: '120.50', description: 'Orders amount avg' })
  @IsString()
  @Expose()
  orders_amount_avg!: string;

  @ApiProperty({ type: 'number', example: 2, description: 'Promo codes used' })
  @IsNumber()
  @Expose()
  promo_codes_used!: number;

  @ApiProperty({ type: 'number', example: 2, description: 'Unique promo codes used' })
  @IsNumber()
  @Expose()
  promo_codes_unique!: number;

  @ApiProperty({ type: 'string', example: '15.00', description: 'Discount sum' })
  @IsString()
  @Expose()
  discount_sum!: string;

  @ApiProperty({ type: 'string', example: '5.00', description: 'Discount min' })
  @IsString()
  @Expose()
  discount_min!: string;

  @ApiProperty({ type: 'string', example: '20.00', description: 'Discount max' })
  @IsString()
  @Expose()
  discount_max!: string;

  @ApiProperty({ type: 'string', example: '10.00', description: 'Discount avg' })
  @IsString()
  @Expose()
  discount_avg!: string;

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
