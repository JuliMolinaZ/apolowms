import { Module } from '@nestjs/common';
import { PutawayController } from './putaway.controller';
import { PutawayService } from './putaway.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PutawayController],
  providers: [PutawayService],
})
export class PutawayModule {}
