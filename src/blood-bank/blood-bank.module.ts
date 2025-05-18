import { Module } from '@nestjs/common';
import { BloodBankController } from './blood-bank.controller';
import { BloodBankService } from './blood-bank.service';
import { HospitalModule } from 'src/hospital/module/hospital.module';

@Module({
  imports: [HospitalModule],
  providers: [BloodBankService],
  controllers: [BloodBankController],
})
export class BloodBankModule {}
