import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  private prisma = new PrismaClient();

  async findAll() {
    return await this.prisma.item.findMany();
  }

  async findOne(id: number) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }
    return item;
  }

  async create(createItemDto: CreateItemDto) {
    try {
      return await this.prisma.item.create({
        data: createItemDto,
      });
    } catch (error) {
      // Manejo de errores de Prisma (ej. sku duplicado)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU already exists');
      }
      throw error;
    }
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // Verifica que el registro exista antes de actualizar
    await this.findOne(id);
    try {
      return await this.prisma.item.update({
        where: { id },
        data: updateItemDto,
      });
    } catch (error) {
      // Manejo de errores (ej. sku duplicado)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 'P2002') {
        throw new BadRequestException('SKU already exists');
      }
      throw error;
    }
  }

  async delete(id: number) {
    await this.findOne(id);
    return await this.prisma.item.delete({ where: { id } });
  }
}
