import { SerializedView } from '@app/serializer/interface';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class PromoCodeValidityPeriodDto implements SerializedView {
  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2026-02-08T00:00:00.000Z',
    description: 'Start date of validity period',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Expose()
  start?: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date-time',
    example: '2026-03-08T00:00:00.000Z',
    description: 'End date of validity period',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Expose()
  end?: Date;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: PromoCodeValidityPeriodDto,
  };
}
