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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role successfully created.' })
  @ApiBadRequestResponse({
    description: 'Invalid input or error creating role.',
  })
  async createRole(@Body() body: CreateRoleDto, @Res() res: Response) {
    try {
      const role = await this.roleService.createRole(body);
      return res.status(HttpStatus.CREATED).json(role);
    } catch (error: any) {
      error;
    }
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({ status: 200, description: 'Role found.' })
  @ApiNotFoundResponse({ description: 'Role not found.' })
  @ApiBadRequestResponse({ description: 'Invalid role ID.' })
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
      error;
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all roles optionally filtered by hospital ID' })
  @ApiQuery({
    name: 'hospitalId',
    required: false,
    description: 'Hospital ID to filter roles',
  })
  @ApiResponse({ status: 200, description: 'List of roles.' })
  @ApiBadRequestResponse({ description: 'Error retrieving roles.' })
  async getAllRoles(
    @Query('hospitalId') hospitalId: string,
    @Res() res: Response,
  ) {
    try {
      const roles = await this.roleService.getAllRoles(hospitalId);
      return res.json(roles);
    } catch (error: any) {
      error;
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully.' })
  @ApiBadRequestResponse({
    description: 'Invalid input or error updating role.',
  })
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.updateRole(Number(id), updateRoleDto);
      return res.json(role);
    } catch (error: any) {
      error;
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Error deleting role.' })
  async deleteRole(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.roleService.deleteRole(Number(id));
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error: any) {
      error;
    }
  }

  @Put('assign/:id')
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions assigned successfully.',
  })
  @ApiBadRequestResponse({ description: 'Error assigning permissions.' })
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
      error;
    }
  }

  @Patch('remove/:id')
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionIds: { type: 'array', items: { type: 'number' } },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions removed successfully.',
  })
  @ApiBadRequestResponse({ description: 'Error removing permissions.' })
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
      error;
    }
  }
}
