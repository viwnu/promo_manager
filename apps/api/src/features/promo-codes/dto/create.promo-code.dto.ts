import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { PromoCodeLimitDto } from './promo-code-limit.dto';
import { PromoCodeValidityPeriodDto } from './promo-code-validity.dto';

export class CreatePromoCodeDto {
  @ApiProperty({ type: 'string', example: 'SUMMER2026', description: 'Unique promo code' })
  @IsDefined()
  @IsString()
  code!: string;

  @ApiProperty({ type: 'number', example: 15, description: 'Discount percentage' })
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount!: number;

  @ApiProperty({ type: PromoCodeLimitDto, description: 'Usage limits' })
  @IsDefined()
  @ValidateNested()
  @Type(() => PromoCodeLimitDto)
  limit!: PromoCodeLimitDto;

  @ApiPropertyOptional({ type: PromoCodeValidityPeriodDto, description: 'Validity period', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PromoCodeValidityPeriodDto)
  validityPeriod?: PromoCodeValidityPeriodDto;

  @ApiPropertyOptional({ type: 'boolean', example: true, description: 'Active status', required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
