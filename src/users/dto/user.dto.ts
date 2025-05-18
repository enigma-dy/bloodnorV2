import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from 'generated/prisma';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'User password' })
  @IsString()
  password: string;

  @ApiProperty({ example: '123 Main St', description: 'User address' })
  @IsString()
  address: string;

  @ApiProperty({ example: 30, description: 'User age' })
  @IsInt()
  age: number;

  @ApiPropertyOptional({ example: 'O+', description: 'User blood type' })
  @IsOptional()
  bloodType: string;

  @ApiProperty({ example: 'USA', description: 'User country' })
  @IsString()
  country: string;

  @ApiProperty({ example: 12345, description: 'User postal code' })
  @IsInt()
  postalCode: number;

  @ApiProperty({ enum: UserType, description: 'User type' })
  @IsEnum(UserType)
  userType: UserType;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Last donation date',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastDonationDate: Date;

  @ApiHideProperty()
  @IsOptional()
  @Type(() => Date)
  @IsDate({ each: true })
  donationHistoy?: Date[];
}

export class LoginUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd', description: 'User password' })
  @IsString()
  password: string;
}
