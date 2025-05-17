import { IsString } from 'class-validator';

export class BloodGroupDto {
  @IsString()
  type: string;
}
