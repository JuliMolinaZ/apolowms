import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePutawayDto } from './dto/create-putaway.dto';
import { UpdatePutawayDto } from './dto/update-putaway.dto';

@Injectable()
export class PutawayService {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll() {
    return await this.prisma.putaway.findMany();
  }

  async findOne(id: number) {
    const putaway = await this.prisma.putaway.findUnique({ where: { id } });
    if (!putaway) {
      throw new NotFoundException(`Putaway with id ${id} not found`);
    }
    return putaway;
  }

  async create(createPutawayDto: CreatePutawayDto) {
    return await this.prisma.putaway.create({ data: createPutawayDto });
  }

  async update(id: number, updatePutawayDto: UpdatePutawayDto) {
    await this.findOne(id);
    return await this.prisma.putaway.update({
      where: { id },
      data: updatePutawayDto,
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.prisma.putaway.delete({ where: { id } });
  }
}
