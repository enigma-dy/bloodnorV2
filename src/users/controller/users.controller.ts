import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    try {
      const user = await this.userService.registerUser(body);
      return {
        status: HttpStatus.CREATED,
        message: 'User Registration Successful',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: error.message || 'An error occurred during registration',
      };
    }
  }

  async findUserById(email: string) {
    let user = await this.userService.findUserByEmail(email);
  }
}
