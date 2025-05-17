import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/service/auth.service';
import { AuthModule } from './auth/module/auth.module';
import { UserModules } from './users/module/user.module';
import { BloodTypeModule } from './blood-type/module/blood-type.module';
import { JwtModule } from '@nestjs/jwt';
import { RoleModule } from './role/role.modules';
import { PermissionModule } from './permission/permission.modules';
import { NotificationModule } from './notification/notification.module';
import { HospitalModule } from './hospital/module/hospital.module';
import { BloodBankModule } from './blood-bank/blood-bank.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModules,
    BloodTypeModule,
    JwtModule,
    RoleModule,
    PermissionModule,
    NotificationModule,
    HospitalModule,
    BloodBankModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
