import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../common/user-role.enum';
import {
  IS_PUBLIC_KEY,
  ROLES_KEY,
} from '../decorators/authorize-roles.decorator';
import { RoleEntity } from 'src/users/entities/role.entity';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    if (!requiredRoles) {
      return true;
    }
    const user = request.currentUser;
    return requiredRoles.some((requiredRole) =>
      user.roles?.some(
        (userRole: RoleEntity) => userRole.name === requiredRole,
      ),
    );
  }
}
