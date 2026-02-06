import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { User } from '../../schema';

export class UserInternalView extends PickType(User, ['nickname']) {
  @ApiProperty({ type: 'string', example: 'c47f3448-0a96-487f-b602-0a4529825fa2', description: 'The unique user id' })
  @IsMongoId()
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', example: 'Destroer 8000', description: 'User nickname' })
  @IsString()
  @Expose()
  nickname: string;

  @Expose()
  userIdentity: UserIdentityDTO;
}
