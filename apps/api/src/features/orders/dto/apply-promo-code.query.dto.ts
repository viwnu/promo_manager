import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsString } from 'class-validator';

export class ApplyPromoCodeQueryDto {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'Order id' })
  @IsDefined()
  @IsMongoId()
  orderId!: string;

  @ApiProperty({ type: 'string', example: 'SUMMER2026', description: 'Promo code' })
  @IsDefined()
  @IsString()
  code!: string;
}
