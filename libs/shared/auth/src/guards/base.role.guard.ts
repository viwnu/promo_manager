import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators';

@Injectable()
export class BaseRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (roles.some((role) => this.extractRolesFromUser(user).includes(role))) {
      return true;
    } else {
      throw new ForbiddenException('Действие запрещено');
    }
  }

  extractRolesFromUser(user: any) {
    const roles = user?.roles;
    if (!roles) throw new ForbiddenException('Действие запрещено');
    return roles;
  }
}
