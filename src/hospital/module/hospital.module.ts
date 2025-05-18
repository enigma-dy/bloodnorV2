import { Module } from '@nestjs/common';
import { HospitalService } from '../serivce/hospital.service';
import { HospitalController } from '../controller/hospital.controller';

@Module({
  providers: [HospitalService],
  controllers: [HospitalController],
  exports: [HospitalService],
})
export class HospitalModule {}
