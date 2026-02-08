import { ApiProperty, PickType } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';

import { User } from '../../schema';
import { Expose, Type } from 'class-transformer';
import { UserIdentityDTO } from '@app/auth/dto/input';
import { IsMongoId, IsString } from 'class-validator';

class UserIdentityViewDTO extends PickType(UserIdentityDTO, ['email', 'active']) {}

export class UserViewAllDTO extends PickType(User, ['name']) {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique user id' })
  @IsMongoId()
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Destroer 8000', description: 'User name' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({
    type: UserIdentityViewDTO,
    description: 'User identity',
  })
  @Type(() => UserIdentityViewDTO)
  @Expose()
  userIdentity: UserIdentityViewDTO;

  static serializerOptions: ClassSerializerContextOptions = {
    strategy: 'excludeAll',
    type: UserViewAllDTO,
    enableImplicitConversion: true,
  };
}
