import { ApiProperty } from '@nestjs/swagger';

export class CreatePizzaDto {
  @ApiProperty({
    description: 'The name of the pizza',
    example: 'Margherita',
  })
  name: string;

  @ApiProperty({
    description: 'The price of the pizza',
    example: 9.99,
  })
  price: number;

  @ApiProperty({
    description: 'The discount rate of the pizza',
    example: 0.2,
  })
  discount: number;

  @ApiProperty({
    description: 'The number of sales for the pizza',
    example: 150,
  })
  sales: number;

  @ApiProperty({
    description: 'The size of the pizza in inches',
    example: 12,
  })
  size: number;

  @ApiProperty({
    description: 'The tag of the pizza',
    example: 'discount',
    enum: ['discount', 'classic', 'set'], // 列出所有可能的枚举值
  })
  tag: string;

  @ApiProperty({
    description: 'The image source URL of the pizza',
    example: 'https://example.com/pizza.jpg',
    required: false,
  })
  src?: string;
}
