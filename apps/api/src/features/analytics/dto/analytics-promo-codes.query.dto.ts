import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { AnalyticsBaseQueryDto } from './analytics-base.query.dto';

export class AnalyticsPromoCodesQueryDto extends AnalyticsBaseQueryDto {
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
