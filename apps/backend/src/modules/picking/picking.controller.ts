import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PickingService } from './picking.service';
import { CreatePickingDto } from './dto/create-picking.dto';
import { UpdatePickingDto } from './dto/update-picking.dto';

@Controller('picking')
export class PickingController {
  constructor(private readonly pickingService: PickingService) {}

  // Este método ahora consulta la base de datos y devuelve un array
  @Get()
  async findAll() {
    return await this.pickingService.findAll();
  }

  @Post()
  async create(@Body() createPickingDto: CreatePickingDto) {
    return await this.pickingService.create(createPickingDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pickingService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePickingDto: UpdatePickingDto,
  ) {
    return await this.pickingService.update(+id, updatePickingDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.pickingService.delete(+id);
  }
}
