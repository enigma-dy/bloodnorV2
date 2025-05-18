// src/auth/guards/roles-permissions.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLES_KEY } from 'src/role/role.decorator';
import { PERMISSIONS_KEY } from 'src/permission/permission.decorator';

@Injectable()
export class RolesPermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.userId) {
      throw new ForbiddenException('Invalid user');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        roles: {
          include: { permissions: true },
        },
      },
    });

    if (!dbUser) {
      throw new ForbiddenException('User not found');
    }

    const userRoles = dbUser.roles.map((role) => role.roleName);
    const userPermissions = dbUser.roles.flatMap((role) =>
      role.permissions.map((perm) => perm.action),
    );

    const hasRole =
      !requiredRoles || requiredRoles.some((r) => userRoles.includes(r));

    const hasPermission =
      !requiredPermissions ||
      requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasRole || !hasPermission) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
