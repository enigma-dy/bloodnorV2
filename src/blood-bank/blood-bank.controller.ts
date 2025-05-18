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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateBloodBankDto, UpdateBloodBankDto } from './dto/blood-bank.dto';
import { BloodBankService } from './blood-bank.service';

@ApiTags('Blood Bank')
@Controller('blood-bank')
export class BloodBankController {
  constructor(private readonly bloodBankService: BloodBankService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new blood bank' })
  @ApiResponse({ status: 201, description: 'Blood bank created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createBloodBank(@Body() createBloodBankDto: CreateBloodBankDto) {
    try {
      return await this.bloodBankService.createBloodBank(createBloodBankDto);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get a blood bank by ID' })
  @ApiParam({ name: 'id', description: 'Blood bank ID' })
  @ApiResponse({ status: 200, description: 'Blood bank found' })
  @ApiResponse({ status: 404, description: 'Blood bank not found' })
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
  @ApiOperation({ summary: 'Get all blood banks' })
  @ApiQuery({
    name: 'hospitalId',
    required: false,
    description: 'Filter by hospital ID',
  })
  @ApiResponse({ status: 200, description: 'List of blood banks' })
  async getAllBloodBanks(@Query('hospitalId') hospitalId?: string) {
    try {
      return await this.bloodBankService.getAllBloodBanks(hospitalId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update a blood bank' })
  @ApiParam({ name: 'id', description: 'Blood bank ID' })
  @ApiResponse({ status: 200, description: 'Blood bank updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
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
  @ApiOperation({ summary: 'Delete a blood bank' })
  @ApiParam({ name: 'id', description: 'Blood bank ID' })
  @ApiResponse({ status: 204, description: 'Blood bank deleted successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async deleteBloodBank(@Param('id') id: string) {
    try {
      await this.bloodBankService.deleteBloodBank(id);
      return { statusCode: HttpStatus.NO_CONTENT };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('by-hospital/:hospitalId')
  @ApiOperation({ summary: 'Get blood banks by hospital ID' })
  @ApiParam({ name: 'hospitalId', description: 'Hospital ID' })
  @ApiResponse({
    status: 200,
    description: 'List of blood banks for the hospital',
  })
  async getBloodBanksByHospital(@Param('hospitalId') hospitalId: string) {
    try {
      return await this.bloodBankService.getBloodBanksByHospital(hospitalId);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
