import { PickType } from '@nestjs/swagger';
import { ClassSerializerContextOptions } from '@nestjs/common';

import { UserSelfView } from './user-self.view.dto';

export class UserViewAllDTO extends PickType(UserSelfView, ['id', 'nickname']) {
  static serializerOptions: ClassSerializerContextOptions = { strategy: 'excludeAll', type: UserViewAllDTO };
}
