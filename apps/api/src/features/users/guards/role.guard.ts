import { Injectable, ForbiddenException } from '@nestjs/common';
import { BaseRolesGuard } from '@app/auth/guards';

@Injectable()
export class RolesGuard extends BaseRolesGuard {
  extractRolesFromUser(user: any) {
    const roles = user?.userIdentity?.roles;
    if (!roles) throw new ForbiddenException('Действие запрещено');
    return roles;
  }
}
