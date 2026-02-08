import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UserEmailDTO extends PickType(CreateUserDto, ['email']) {}
