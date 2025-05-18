import { PrismaClient } from '@prisma/client';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}
  async createPermission(createPermissionDto: CreatePermissionDto) {
    const { action, description } = createPermissionDto;

    // Check if permission with same action already exists
    const existingPermission = await this.prisma.permission.findFirst({
      where: { action },
    });

    if (existingPermission) {
      throw new Error('Permission with this action already exists');
    }

    return this.prisma.permission.create({
      data: {
        action,
        description,
      },
    });
  }

  async getPermissionById(id: number) {
    return this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany({
      include: {
        roles: true,
      },
    });
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    const { action, description } = updatePermissionDto;

    if (action) {
      const existingPermission = await this.prisma.permission.findFirst({
        where: {
          action,
          NOT: { id },
        },
      });

      if (existingPermission) {
        throw new Error('Permission with this action already exists');
      }
    }

    return this.prisma.permission.update({
      where: { id },
      data: {
        action,
        description,
      },
    });
  }

  async deletePermission(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!permission) {
      throw new Error('Permission not found');
    }

    if (permission.roles.length > 0) {
      throw new Error('Cannot delete permission assigned to roles');
    }

    return this.prisma.permission.delete({
      where: { id },
    });
  }
}
