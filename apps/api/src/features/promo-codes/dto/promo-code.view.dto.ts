import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsMongoId, IsNumber, IsString } from 'class-validator';

import { PromoCode } from '../schema';
import { PromoCodeLimitDto } from './promo-code-limit.dto';
import { PromoCodeValidityPeriodDto } from './promo-code-validity.dto';
import { SerializedView } from '@app/serializer/interface';

export const excludeEmptyObject = ({ value }) => (Object.values(value).filter((val) => val).length === 0 ? undefined : value);

export class PromoCodeViewDto extends PromoCode implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Promo code id' })
  @IsMongoId()
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string', example: 'SUMMER2026', description: 'Unique promo code' })
  @IsString()
  @Expose()
  code!: string;

  @ApiProperty({ type: 'number', example: 15, description: 'Discount percentage' })
  @IsNumber()
  @Expose()
  discount!: number;

  @ApiProperty({ type: PromoCodeLimitDto, description: 'Usage limits' })
  @Type(() => PromoCodeLimitDto)
  @Transform(excludeEmptyObject, { toPlainOnly: true })
  @Expose()
  limit!: PromoCodeLimitDto;

  @ApiPropertyOptional({ type: PromoCodeValidityPeriodDto, description: 'Validity period', required: false })
  @Type(() => PromoCodeValidityPeriodDto)
  @Transform(excludeEmptyObject, { toPlainOnly: true })
  @Expose()
  validityPeriod?: PromoCodeValidityPeriodDto;

  @ApiProperty({ type: 'boolean', example: true, description: 'Active status' })
  @IsBoolean()
  @Expose()
  active!: boolean;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: PromoCodeViewDto,
  };
}
