import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(@Body() body: CreateRoleDto, @Res() res: Response) {
    try {
      const role = await this.roleService.createRole(body);
      return res.status(HttpStatus.CREATED).json(role);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('get/:id')
  async getRole(@Param('id') id: string, @Res() res: Response) {
    try {
      const role = await this.roleService.getRoleById(Number(id));
      if (role) {
        return res.json(role);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Role not found' });
      }
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get('all')
  async getAllRoles(
    @Query('hospitalId') hospitalId: string,
    @Res() res: Response,
  ) {
    try {
      const roles = await this.roleService.getAllRoles(hospitalId);
      return res.json(roles);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Patch('update/:id')
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.updateRole(Number(id), updateRoleDto);
      return res.json(role);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('delete/:id')
  async deleteRole(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.roleService.deleteRole(Number(id));
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Put('assign/:id')
  async assignPermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: number[],
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.assignPermissionsToRole(
        Number(id),
        permissionIds,
      );
      return res.json(role);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Patch('remove/:id')
  async removePermissions(
    @Param('id') id: string,
    @Body('permissionIds') permissionIds: number[],
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.removePermissionsFromRole(
        Number(id),
        permissionIds,
      );
      return res.json(role);
    } catch (error: any) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
