import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'pizzaId',
    example: '123-456-789',
  })
  pizzaId: string;

  @ApiProperty({
    description: '数量',
    example: 1,
  })
  quantity: number;

  @ApiProperty({
    default: false,
    required: false,
    description: '是否选中',
    example: true,
  })
  selected?: boolean;
}
