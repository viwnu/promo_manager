import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';
import { UserIdentity } from '../../db';

export class CreateUserIdentityModel extends PickType(UserIdentity, ['email', 'password']) {
  @ApiProperty({ type: 'string', description: 'user email', example: 'example@email.com' })
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', description: 'user password', example: 'my-strong-password' })
  @IsDefined()
  password: string;
}
