import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsString } from 'class-validator';
import { ClassSerializerContextOptions } from '@nestjs/common';
import { Expose } from 'class-transformer';

import { User } from '../../schema';
import { UserIdentityDTO } from '@app/auth/dto/input';
import { SerializedView } from '@app/serializer/interface';

export class UserSelfView extends PickType(User, ['name']) implements SerializedView {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique user id' })
  @IsMongoId()
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Destroer 8000', description: 'User name' })
  @IsString()
  @Expose()
  name: string;

  @ApiProperty({ type: 'string', example: 'example@email.com', description: 'User email' })
  @IsEmail()
  @Expose()
  get email(): string {
    return this.userIdentity.email;
  }
  userIdentity: Pick<UserIdentityDTO, 'email'>;

  static serializerOptions: ClassSerializerContextOptions = { strategy: 'excludeAll', type: UserSelfView };
}
