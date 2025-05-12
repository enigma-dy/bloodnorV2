import { IsEmail, IsInt, IsNumber, IsString } from 'class-validator';

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
  @IsString()
  bloodType: string;
  @IsString()
  country: string;
  @IsInt()
  postalCode: number;
}

export class LoginUserDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
