import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission successfully created.' })
  @ApiBadRequestResponse({
    description: 'Invalid input or error creating permission.',
  })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionService.createPermission(createPermissionDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get/:id')
  @ApiOperation({ summary: 'Get a permission by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission found.' })
  @ApiNotFoundResponse({ description: 'Permission not found.' })
  @ApiBadRequestResponse({ description: 'Invalid permission ID.' })
  async getPermission(@Param('id') id: string) {
    try {
      const permission = await this.permissionService.getPermissionById(
        Number(id),
      );
      if (!permission) {
        throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
      }
      return permission;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, description: 'List of permissions.' })
  @ApiBadRequestResponse({ description: 'Error retrieving permissions.' })
  async getAllPermissions() {
    try {
      return await this.permissionService.getAllPermissions();
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a permission by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({ status: 200, description: 'Permission updated successfully.' })
  @ApiBadRequestResponse({
    description: 'Invalid input or error updating permission.',
  })
  async updatePermission(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    try {
      return await this.permissionService.updatePermission(
        Number(id),
        updatePermissionDto,
      );
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a permission by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiResponse({ status: 204, description: 'Permission deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Error deleting permission.' })
  async deletePermission(@Param('id') id: string) {
    try {
      await this.permissionService.deletePermission(Number(id));
      return { statusCode: HttpStatus.NO_CONTENT };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
