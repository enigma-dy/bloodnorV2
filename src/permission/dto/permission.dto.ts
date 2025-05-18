import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'generated/prisma';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ example: 'read', description: 'Action name' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiPropertyOptional({
    example: 'Allows reading data',
    description: 'Description of the permission',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePermissionDto {
  @ApiPropertyOptional({ example: 'write', description: 'Action name' })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiPropertyOptional({
    example: 'Allows writing data',
    description: 'Description of the permission',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['ADMIN', 'USER'],
    description: 'Roles associated with the permission',
  })
  @IsOptional()
  role: Role[];
}

export class PermissionResponseDto {
  @ApiProperty({ example: 1, description: 'Permission ID' })
  @IsString()
  id: number;

  @ApiProperty({ example: 'read', description: 'Action name' })
  @IsString()
  action: string;

  @ApiPropertyOptional({
    example: 'Allows reading data',
    description: 'Description of the permission',
  })
  @IsString()
  description?: string;
}
