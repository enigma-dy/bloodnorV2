import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionResponseDto } from 'src/permission/dto/permission.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role' })
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @ApiPropertyOptional({ description: 'Associated hospital ID' })
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @ApiPropertyOptional({
    description: 'Array of permission IDs assigned to the role',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  permissions?: number[];
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ description: 'Updated role name' })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiPropertyOptional({ description: 'Updated hospital ID' })
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @ApiPropertyOptional({
    description: 'Updated array of permission IDs',
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  permissions?: number[];
}

export class RoleResponseDto {
  @ApiProperty({ description: 'Role ID' })
  id: number;

  @ApiProperty({ description: 'Name of the role' })
  roleName: string;

  @ApiPropertyOptional({ description: 'Associated hospital ID' })
  hospitalId?: string;

  @ApiProperty({
    type: [PermissionResponseDto],
    description: 'Permissions assigned to the role',
  })
  permissions: PermissionResponseDto[];
}
