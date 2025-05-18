import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BloodGroupDto {
  @ApiProperty({ example: 'A+', description: 'Blood group type' })
  @IsString()
  type: string;
}
