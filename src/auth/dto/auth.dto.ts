import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongPassword123', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginHospitalDto {
  @ApiProperty({
    example: 'hospital@example.com',
    description: 'Hospital email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'hospitalPassword123',
    description: 'Hospital password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyUserDto {
  @ApiProperty({
    example: 'verificationToken123',
    description: 'Verification token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
