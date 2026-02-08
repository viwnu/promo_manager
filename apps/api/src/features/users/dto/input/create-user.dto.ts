import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';
import { User } from '../../schema';

export class CreateUserDto extends PickType(User, ['name']) {
  @ApiProperty({ type: 'string', example: 'Steven', description: 'The name of user' })
  @IsDefined()
  @IsString()
  name!: string;

  @ApiProperty({ type: 'string', example: 'example@email.com', description: 'The unique email address' })
  @IsDefined()
  @IsEmail()
  email!: string;

  @ApiProperty({ type: 'string', example: 'my-strong-password', description: 'The password of user' })
  @IsDefined()
  @IsString()
  password!: string;
}
