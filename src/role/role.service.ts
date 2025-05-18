import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}
  async createRole(createRoleDto: CreateRoleDto) {
    const { roleName, hospitalId, permissions } = createRoleDto;

    const hospital = await this.prisma.hospital.findUnique({
      where: { id: hospitalId },
    });

    if (!hospital) {
      throw new Error('Hospital not found');
    }

    const existingRole = await this.prisma.role.findFirst({
      where: {
        roleName,
        hospitalId,
      },
    });

    if (existingRole) {
      throw new BadRequestException(
        'Role with this name already exists in this hospital',
      );
    }

    return this.prisma.role.create({
      data: {
        roleName,
        hospital: { connect: { id: hospitalId } },
        permissions: {
          connect: permissions?.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
        hospital: true,
      },
    });
  }

  async getRoleById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        hospital: true,
        users: true,
      },
    });
  }

  async getAllRoles(hospitalId?: string) {
    const where = hospitalId ? { hospitalId } : {};
    return this.prisma.role.findMany({
      where,
      include: {
        permissions: true,
        hospital: true,
      },
    });
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const { roleName, permissions } = updateRoleDto;

    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (roleName && roleName !== role.roleName) {
      const existingRole = await this.prisma.role.findFirst({
        where: {
          roleName,
          hospitalId: role.hospitalId || undefined,
          NOT: { id },
        },
      });

      if (existingRole) {
        throw new Error('Role with this name already exists in this hospital');
      }
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        roleName,
        permissions: permissions
          ? {
              set: permissions.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        permissions: true,
        hospital: true,
      },
    });
  }

  async deleteRole(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { users: true },
    });

    if (!role) {
      throw new Error('Role not found');
    }

    if (role.users.length > 0) {
      throw new Error('Cannot delete role assigned to users');
    }

    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignPermissionsToRole(roleId: number, permissionIds: number[]) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }

  async removePermissionsFromRole(roleId: number, permissionIds: number[]) {
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          disconnect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    });
  }
}
