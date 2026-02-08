import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsInt, Min } from 'class-validator';

export class PromoCodeLimitDto {
  @ApiProperty({ type: 'number', example: 1000, description: 'Overall usage limit' })
  @IsDefined()
  @IsInt()
  @Min(0)
  overall!: number;

  @ApiProperty({ type: 'number', example: 1, description: 'Usage limit per user' })
  @IsDefined()
  @IsInt()
  @Min(0)
  perUser!: number;
}
