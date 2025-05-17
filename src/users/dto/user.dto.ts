import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserType } from 'generated/prisma';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  address: string;

  @IsInt()
  age: number;

  @IsOptional()
  bloodType: string;

  @IsString()
  country: string;

  @IsInt()
  postalCode: number;

  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsDate()
  lastDonationDate: Date;

  @IsOptional()
  @IsDate({ each: true })
  donationHistoy?: Date[];
}

export class LoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
