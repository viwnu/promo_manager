import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsDefined, IsEmail, IsEnum, IsMongoId } from 'class-validator';
import { UserIdentity } from '../../db';
import { ROLE } from '@app/auth/const';

export class UserIdentityDTO extends PickType(UserIdentity, ['email', 'active', 'roles']) {
  @IsDefined()
  @IsEmail()
  @Expose()
  email: string;

  @IsDefined()
  @IsBoolean()
  @Expose()
  active: boolean;

  @IsDefined()
  @IsEnum(ROLE)
  @Expose()
  roles: ROLE[];

  @IsDefined()
  @IsMongoId()
  @Expose()
  id: string;
}
