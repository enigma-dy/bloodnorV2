import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/users/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'generated/prisma';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const { email, firstName, lastName } = req.user;

    let user = await this.userService.findUserByEmail(email);

    if (!user) {
      user = await this.userService.registerUser({
        email,
        firstName,
        lastName,
        phoneNumber: '',
        password: '',
        address: '',
        age: 0,
        userType: UserType.DONOR,
        bloodType: 'O+',
        country: '',
        postalCode: 0,
        lastDonationDate: new Date(),
      });
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Google Login Successful',
      token,
      user,
    };
  }
}
