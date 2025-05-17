import { Module } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UsersController } from '../controller/users.controller';
import { BloodTypeModule } from 'src/blood-type/module/blood-type.module';

@Module({
  imports: [BloodTypeModule],
  providers: [UserService],
  controllers: [UsersController],
  exports: [UserService],
})
export class UserModules {}
