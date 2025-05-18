import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BloodTypeService } from '../service/blood-type.service';
import { BloodGroupDto } from '../dto/blood-type.dto';
import { JwtAuthGuard } from 'src/auth/gauards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('blood-type')
export class BloodTypeController {
  constructor(private readonly bloodType: BloodTypeService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new blood type' })
  @ApiBody({ type: BloodGroupDto })
  @ApiResponse({ status: 201, description: 'Blood type successfully created.' })
  @ApiBadRequestResponse({
    description: 'Invalid input or error creating blood type.',
  })
  async createBlood(@Body() body: BloodGroupDto) {
    try {
      return await this.bloodType.createBloodType(body.type);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
