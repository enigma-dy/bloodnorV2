import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'generated/prisma';

export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  role: Role[];
}

export class PermissionResponseDto {
  id: number;
  action: string;
  description?: string;
}
