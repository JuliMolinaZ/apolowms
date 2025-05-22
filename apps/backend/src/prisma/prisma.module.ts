import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: prisma,
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
