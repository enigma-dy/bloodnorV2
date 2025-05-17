import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PermissionResponseDto } from 'src/permission/dto/permission.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsArray()
  permissions?: number[];
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  roleName?: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsArray()
  permissions?: number[];
}

export class RoleResponseDto {
  id: number;
  roleName: string;
  hospitalId?: string;
  permissions: PermissionResponseDto[];
}
