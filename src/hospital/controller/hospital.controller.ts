import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { HospitalService } from '../serivce/hospital.service';
import { RegisterHospitalDto } from '../dto/hospital.dto';

@ApiTags('Hospitals')
@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new hospital' })
  @ApiBody({ type: RegisterHospitalDto })
  @ApiResponse({ status: 201, description: 'Hospital registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async registerHospital(
    @Body() data: RegisterHospitalDto,
  ): Promise<{ name: string; email: string }> {
    return this.hospitalService.registerHospital(data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update hospital details' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiBody({ type: RegisterHospitalDto, required: false })
  @ApiResponse({ status: 200, description: 'Hospital updated successfully' })
  @ApiResponse({ status: 409, description: 'Hospital not registered' })
  async updateHospital(
    @Param('id') hospitalId: string,
    @Body() data: Omit<Partial<RegisterHospitalDto>, 'password'>,
  ): Promise<{ name: string; email: string }> {
    return this.hospitalService.updateHospital(hospitalId, data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get hospital by ID' })
  @ApiParam({ name: 'id', description: 'Hospital ID' })
  @ApiResponse({ status: 200, description: 'Hospital found' })
  @ApiResponse({ status: 400, description: 'Hospital not found' })
  async findHospitalById(
    @Param('id') hospitalId: string,
  ): Promise<{ name: string; email: string }> {
    return this.hospitalService.findHospitalById(hospitalId);
  }

  @Get()
  @ApiOperation({ summary: 'List hospitals with filters and pagination' })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by name, city, or country',
  })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'isVerified', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllHospital(
    @Query('search') search?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('country') country?: string,
    @Query('isVerified', ParseBoolPipe) isVerified?: boolean,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    const filters = {
      search,
      city,
      state,
      country,
      isVerified,
      pagination: {
        page,
        limit,
      },
    };
    return this.hospitalService.findAllHospital(filters);
  }
}
