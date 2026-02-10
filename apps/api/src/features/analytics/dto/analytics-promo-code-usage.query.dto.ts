import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { AnalyticsBaseQueryDto } from './analytics-base.query.dto';

export class AnalyticsPromoCodeUsageQueryDto extends AnalyticsBaseQueryDto {
  @ApiPropertyOptional({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsOptional()
  @IsString()
  promoCodeId?: string;

  @ApiPropertyOptional({ type: 'string', example: 'SUMMER2026', description: 'Promo code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'User id' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Order id' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ type: 'string', example: 'user@email.com', description: 'Email' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ type: 'string', example: 'John', description: 'Name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: 'string', example: '+12025550123', description: 'Phone' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ type: 'string', example: 'john', description: 'Search in code/email/name/phone' })
  @IsOptional()
  @IsString()
  search?: string;
}
