import { Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UsersController } from '../controller/users.controller';

@Module({
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModules {}
