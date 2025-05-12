import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BloodTypeService } from '../service/blood-type.service';
import { BloodGroupDto } from '../dto/blood-type.dto';
import { JwtAuthGuard } from 'src/auth/gauards/jwt-auth.guard';

@Controller('blood-type')
export class BloodTypeController {
  constructor(private readonly bloodType: BloodTypeService) {}

  @Post('create')
  @Post('create')
  async createBlood(@Body() body: BloodGroupDto) {
    try {
      return await this.bloodType.createBlood(body.type);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('secure')
  getSecureData() {
    return { message: 'You have access!' };
  }
}
