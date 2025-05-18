import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserType } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/gauards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/dto/google-strategy.dto';
import { BloodTypeService } from 'src/blood-type/service/blood-type.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly bloodType: BloodTypeService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registration successful.' })
  @ApiResponse({
    status: 400,
    description: 'Blood group does not exist or validation failed.',
  })
  async register(@Body() body: CreateUserDto) {
    try {
      const bloodGroup = await this.bloodType.findBloodType(body.bloodType);
      if (!bloodGroup) {
        throw new BadRequestException('Blood group does not exist');
      }

      const user = await this.userService.registerUser(body);
      return {
        message: 'User registration successful',
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('all')
  @ApiOperation({ summary: 'Get list of users with optional filters' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'bloodType', required: false, type: String })
  @ApiQuery({ name: 'userType', required: false, enum: UserType })
  @ApiQuery({ name: 'minAge', required: false, type: Number })
  @ApiQuery({ name: 'maxAge', required: false, type: Number })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date ISO string',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date ISO string',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getUsers(
    @Query('search') search?: string,
    @Query('bloodType') bloodType?: string,
    @Query('userType') userType?: UserType,
    @Query('minAge') minAge?: number,
    @Query('maxAge') maxAge?: number,
    @Query('country') country?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getAllUsers({
      search,
      bloodType,
      userType,
      ageRange: {
        min: minAge ? Number(minAge) : undefined,
        max: maxAge ? Number(maxAge) : undefined,
      },
      country,
      dateRange: {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined,
      },
      pagination: {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      },
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current logged-in user profile' })
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getMe(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserById(@Req() id: string) {
    return this.userService.findUserById(id);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current logged-in user profile' })
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() body: Partial<CreateUserDto>,
  ) {
    return this.userService.editUser(req.user.userId, body);
  }
}
