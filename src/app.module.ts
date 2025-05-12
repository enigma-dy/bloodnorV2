import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthService } from './auth/service/auth.service';
import { AuthModule } from './auth/module/auth.module';
import { UserModules } from './users/module/user.module';
import { BloodTypeModule } from './blood-type/module/blood-type.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, AuthModule, UserModules, BloodTypeModule, JwtModule],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
