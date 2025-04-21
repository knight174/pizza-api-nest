import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePizzaDto } from './dto/create-pizza.dto';
import { UpdatePizzaDto } from './dto/update-pizza.dto';

@Injectable()
export class PizzasService {
  constructor(private prisma: PrismaService) {}

  create(createPizzaDto: CreatePizzaDto) {
    return this.prisma.pizza.create({ data: createPizzaDto });
  }

  findAll(kind: string) {
    // 根据kind参数过滤披萨列表
    if (kind !== 'all') {
      return this.prisma.pizza.findMany({
        where: {
          tag: kind,
          deleted_at: null,
        },
      });
    } else {
      return this.prisma.pizza.findMany({
        where: {
          deleted_at: null,
        },
      });
    }
  }

  findOne(id: string) {
    return this.prisma.pizza.findUnique({ where: { id, deleted_at: null } });
  }

  update(id: string, updatePizzaDto: UpdatePizzaDto) {
    return this.prisma.pizza.update({
      where: { id },
      data: updatePizzaDto,
    });
  }

  remove(id: string) {
    // return this.prisma.pizza.delete({ where: { id } });
    // soft delete
    return this.prisma.pizza.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
