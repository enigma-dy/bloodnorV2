import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginUserDto } from 'src/users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/users/service/user.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

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
        bloodType: 'O+',
        country: '',
        postalCode: 0,
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
