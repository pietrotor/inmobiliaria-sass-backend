import { Global, Module } from '@nestjs/common';
import { BusinessHoursService } from './business-hours.service';

@Global()
@Module({
  providers: [BusinessHoursService],
  exports: [BusinessHoursService],
})
export class BusinessHoursModule {}
