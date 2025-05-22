import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreatePickingDto } from './dto/create-picking.dto';
import { UpdatePickingDto } from './dto/update-picking.dto';

@Injectable()
export class PickingService {
  private prisma = new PrismaClient();

  async findAll() {
    // Retorna un array de registros; si no hay datos, retorna []
    return await this.prisma.picking.findMany();
  }

  async create(createPickingDto: CreatePickingDto) {
    return await this.prisma.picking.create({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: createPickingDto,
    });
  }

  async findOne(id: number) {
    const picking = await this.prisma.picking.findUnique({
      where: { id },
    });
    if (!picking) {
      throw new NotFoundException(`Picking with id ${id} not found`);
    }
    return picking;
  }

  async update(id: number, updatePickingDto: UpdatePickingDto) {
    await this.findOne(id); // Verifica que existe
    return await this.prisma.picking.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: updatePickingDto,
    });
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.prisma.picking.delete({
      where: { id },
    });
  }
}
