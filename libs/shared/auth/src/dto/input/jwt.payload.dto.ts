import { PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsMongoId } from 'class-validator';
import { Expose } from 'class-transformer';
import { UserIdentity } from '../../db';

export class JwtPayloadDTO extends PickType(UserIdentity, ['email']) {
  @IsDefined()
  @IsEmail()
  @Expose()
  email: string;

  @IsDefined()
  @IsMongoId()
  @Expose()
  sub: string;
}
