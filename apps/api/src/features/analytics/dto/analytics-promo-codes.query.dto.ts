import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { AnalyticsPromoCodesDatePreset } from '../types/analytics-promo-codes.types';

export class AnalyticsPromoCodesQueryDto {
  @ApiPropertyOptional({
    enum: ['today', 'last7Days', 'last30Days', 'custom'],
    description: 'Date preset for stats range',
  })
  @IsOptional()
  @IsEnum(['today', 'last7Days', 'last30Days', 'custom'])
  datePreset?: AnalyticsPromoCodesDatePreset;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: '2026-02-10', description: 'Start date' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date', example: '2026-02-10', description: 'End date' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ type: 'number', example: 50, description: 'Limit' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  limit?: number;

  @ApiPropertyOptional({ type: 'number', example: 0, description: 'Offset' })
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : Number(value)))
  @IsInt()
  @Min(0)
  offset?: number;

  @ApiPropertyOptional({ type: 'string', example: 'uses_count', description: 'Sort field' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Sort direction' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';

  @ApiPropertyOptional({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsOptional()
  @IsString()
  promoCodeId?: string;

  @ApiPropertyOptional({ type: 'string', example: 'SUMMER2026', description: 'Promo code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ type: 'string', example: 'summer', description: 'Search in code' })
  @IsOptional()
  @IsString()
  search?: string;
}
