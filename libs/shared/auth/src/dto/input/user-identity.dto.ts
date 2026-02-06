import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsMongoId } from 'class-validator';
import { UserIdentity } from '../../db';

export class UserIdentityDTO extends PickType(UserIdentity, ['email']) {
  @IsDefined()
  @IsEmail()
  @Expose()
  email: string;

  @IsDefined()
  @IsMongoId()
  @Expose()
  id: string;
}
