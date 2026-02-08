import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class PromoCodeValidityPeriodDto {
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
  end?: Date;
}
