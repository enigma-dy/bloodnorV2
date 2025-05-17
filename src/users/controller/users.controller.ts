import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserType } from 'generated/prisma';
import { JwtAuthGuard } from 'src/auth/gauards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/dto/google-strategy.dto';
import { BloodTypeService } from 'src/blood-type/service/blood-type.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UserService,
    private readonly bloodType: BloodTypeService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    try {
      const bloodGroup = await this.bloodType.findBloodType(body.bloodType);
      if (!bloodGroup) {
        throw new BadRequestException('BloodGroup doesnt not exit');
      }
      const user = await this.userService.registerUser(body);
      return {
        status: HttpStatus.CREATED,
        message: 'User Registration Successful',
        user,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'An error occurred during registration',
      };
    }
  }

  @Get('all')
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
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.userService.getMe(req.user.userId);
  }

  @Get(':id')
  async getUserById(@Req() id: string) {
    this.userService.findUserById(id);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: AuthenticatedRequest,
    @Body() body: Partial<CreateUserDto>,
  ) {
    this.userService.editUser(req.user.userId, body);
  }
}
