import { Pizza } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class PizzaEntity implements Pizza {
  @ApiProperty({
    description: 'Unique identifier for the pizza',
    example: 'e0169a2c-1509-4050-9195-1fa30062ff97',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the pizza',
    example: 'Pizza 1',
  })
  name: string;

  @ApiProperty({
    description: 'Price of the pizza',
    example: 10.0,
  })
  price: Decimal;

  @ApiProperty({
    description: 'Discount rate applied to the pizza price',
    example: 0.6,
  })
  discount: Decimal;

  @ApiProperty({
    description: 'Number of units sold',
    example: 10,
  })
  sales: number;

  @ApiProperty({
    description: 'Size of the pizza in inches',
    example: 8,
  })
  size: number;

  @ApiProperty({
    description: 'Tag associated with the pizza for categorization',
    example: 'discount',
  })
  tag: string;

  @ApiProperty({
    description: 'Deletion timestamp if the pizza has been soft deleted',
    required: false,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description: 'Timestamp of pizza creation',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp of the last update',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'URL of the pizza image',
    example: 'https://images.unsplash.com/...',
    required: false,
  })
  src: string;
}
