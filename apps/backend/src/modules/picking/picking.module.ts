import { Module } from '@nestjs/common';
import { PickingController } from './picking.controller';
import { PickingService } from './picking.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PickingController],
  providers: [PickingService],
})
export class PickingModule {}
