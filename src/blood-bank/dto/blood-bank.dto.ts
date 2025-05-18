import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Hospital } from 'generated/prisma';
import { RegisterHospitalDto } from 'src/hospital/dto/hospital.dto';

export class CreateBloodBankDto {
  @ApiProperty({ example: 'Red Cross Blood Bank' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Street, City, Country' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'hospital-uuid-1234' })
  @IsString()
  @IsNotEmpty()
  hospitalId: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class UpdateBloodBankDto {
  @ApiPropertyOptional({ example: 'Red Cross Blood Bank - Branch 2' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '456 Avenue, New City, Country' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'hospital-uuid-5678' })
  @IsOptional()
  @IsString()
  hospitalId?: string;

  @ApiPropertyOptional({ example: '+1987654321' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: () => RegisterHospitalDto })
  @IsOptional()
  @IsString() // Optional: only if you're storing serialized data
  hospital: Hospital;
}

export class BloodBankResponseDto {
  @ApiProperty({ example: 'bloodbank-uuid-1234' })
  id: string;

  @ApiProperty({ example: 'Red Cross Blood Bank' })
  name: string;

  @ApiProperty({ example: '123 Street, City, Country' })
  address: string;

  @ApiProperty({ example: 'hospital-uuid-1234' })
  hospitalId: string;

  @ApiProperty({ example: '+1234567890' })
  phoneNumber: string;

  @ApiProperty({ type: () => RegisterHospitalDto })
  hospital: Hospital;
}
