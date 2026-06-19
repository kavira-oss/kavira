import { Module } from '@nestjs/common';
import { BehaviorsService } from './behaviors.service';
import { BehaviorsController } from './behaviors.controller';

@Module({
  providers: [BehaviorsService],
  controllers: [BehaviorsController],
  exports: [BehaviorsService],
})
export class BehaviorsModule {}
