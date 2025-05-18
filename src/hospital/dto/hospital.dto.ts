import { BloodBank, Role, User } from 'generated/prisma';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsBoolean,
  IsPostalCode,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterHospitalDto {
  @ApiProperty({
    example: 'City Hospital',
    description: 'Name of the hospital',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St', description: 'Hospital address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'Password for hospital login',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '+1234567890', description: 'Hospital phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'REG123456',
    description: 'Hospital registration ID',
  })
  @IsString()
  @IsNotEmpty()
  registrationId: string;

  @ApiProperty({ example: true, description: 'Hospital verification status' })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({
    example: 'hospital@example.com',
    description: 'Hospital email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'New York',
    description: 'City where the hospital is located',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'State where the hospital is located',
  })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({
    example: 'USA',
    description: 'Country where the hospital is located',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '10001', description: 'Postal code of the hospital' })
  @IsString()
  @IsPostalCode('any')
  postalCode: string;
}
