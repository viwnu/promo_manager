import { SerializedView } from '@app/serializer/interface';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsInt, Min } from 'class-validator';

export class PromoCodeLimitDto implements SerializedView {
  @ApiProperty({ type: 'number', example: 1000, description: 'Overall usage limit' })
  @IsDefined()
  @IsInt()
  @Min(0)
  @Expose()
  overall!: number;

  @ApiProperty({ type: 'number', example: 1, description: 'Usage limit per user' })
  @IsDefined()
  @IsInt()
  @Min(0)
  @Expose()
  perUser!: number;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: PromoCodeLimitDto,
  };
}
