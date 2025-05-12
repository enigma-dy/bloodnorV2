import { Module } from '@nestjs/common';
import { BloodTypeService } from '../service/blood-type.service';
import { BloodTypeController } from '../controller/blood-type.controller';

@Module({
  providers: [BloodTypeService],
  controllers: [BloodTypeController],
  exports: [BloodTypeService],
})
export class BloodTypeModule {}
