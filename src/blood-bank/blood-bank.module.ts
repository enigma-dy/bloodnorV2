import { Module } from '@nestjs/common';
import { BloodBankController } from './blood-bank.controller';
import { BloodBankService } from './blood-bank.service';

@Module({
  providers: [BloodBankService],
  controllers: [BloodBankController],
})
export class BloodBankModule {}
