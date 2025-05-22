import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PutawayService } from './putaway.service';
import { CreatePutawayDto } from './dto/create-putaway.dto';
import { UpdatePutawayDto } from './dto/update-putaway.dto';

@Controller('putaway')
export class PutawayController {
  constructor(private readonly putawayService: PutawayService) {}

  @Get()
  async findAll() {
    return await this.putawayService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.putawayService.findOne(+id);
  }

  @Post()
  async create(@Body() createPutawayDto: CreatePutawayDto) {
    return await this.putawayService.create(createPutawayDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePutawayDto: UpdatePutawayDto,
  ) {
    return await this.putawayService.update(+id, updatePutawayDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.putawayService.delete(+id);
  }
}
