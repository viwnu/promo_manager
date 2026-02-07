import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { UserIdentityDTO } from '@app/auth/dto/input';
import { UsersService } from '../users.service';
import { UserInternalView } from '../dto/view';
import { RequestWithProp } from 'libs/shared/decorators/param';
import { REQUEST_PROP_NAMES } from 'apps/api/src/const';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequestUser(request);
  }
  async validateRequestUser(request: RequestWithProp<{ [REQUEST_PROP_NAMES.USER]: UserIdentityDTO }>): Promise<boolean> {
    const fundedUser = await this.userService.findOneByEmail(request.user.email);
    if (!fundedUser) throw new UnauthorizedException('User is not exists');
    this.setRequestUser(request, fundedUser);
    return true;
  }

  setRequestUser(
    request: RequestWithProp<{ [REQUEST_PROP_NAMES.USER]: Omit<UserIdentityDTO, 'email'> }>,
    user: UserInternalView,
  ): void {
    request.user = user;
  }
}
