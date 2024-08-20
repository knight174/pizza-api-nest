import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { updateSelectedMultipleDto } from 'src/carts/dto/update-selected-multiple.dto';

@ApiTags('cart')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  create(@User('id') id: string, @Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(id, createCartDto);
  }

  @Get()
  async findAll(@User('id') id: string) {
    return await this.cartsService.findAllByUserId(id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.cartsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(id, updateCartDto);
  }

  // @Patch('selection') // 更符合 RESTful API 设计
  @Patch('update_selected_mutiple')
  updateMultiple(@Body() dto: updateSelectedMultipleDto) {
    return this.cartsService.updateMultiple(dto.ids, dto.selected);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(id);
  }
}
