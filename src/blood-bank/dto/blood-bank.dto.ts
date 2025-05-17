import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBloodBankDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateBloodBankDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

export class BloodBankResponseDto {
  id: string;
  name: string;
  address: string;
  hospitalId: string;
  phoneNumber: string;
}
