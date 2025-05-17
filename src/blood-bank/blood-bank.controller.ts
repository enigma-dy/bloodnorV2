import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateBloodBankDto, UpdateBloodBankDto } from './dto/blood-bank.dto';
import { BloodBankService } from './blood-bank.service';

@Controller('blood-bank')
export class BloodBankController {
  constructor(private readonly bloodBankService: BloodBankService) {}

  @Post('create')
  async createBloodBank(@Body() createBloodBankDto: CreateBloodBankDto) {
    try {
      return await this.bloodBankService.createBloodBank(createBloodBankDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('get/:id')
  async getBloodBank(@Param('id') id: string) {
    try {
      const bloodBank = await this.bloodBankService.getBloodBankById(id);
      if (!bloodBank) {
        throw new HttpException('Blood bank not found', HttpStatus.NOT_FOUND);
      }
      return bloodBank;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  async getAllBloodBanks(@Query('hospitalId') hospitalId?: string) {
    try {
      return await this.bloodBankService.getAllBloodBanks(hospitalId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('update/:id')
  async updateBloodBank(
    @Param('id') id: string,
    @Body() updateBloodBankDto: UpdateBloodBankDto,
  ) {
    try {
      return await this.bloodBankService.updateBloodBank(
        id,
        updateBloodBankDto,
      );
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('delete/:id')
  async deleteBloodBank(@Param('id') id: string) {
    try {
      await this.bloodBankService.deleteBloodBank(id);
      return { statusCode: HttpStatus.NO_CONTENT };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('by-hospital/:hospitalId')
  async getBloodBanksByHospital(@Param('hospitalId') hospitalId: string) {
    try {
      return await this.bloodBankService.getBloodBanksByHospital(hospitalId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
