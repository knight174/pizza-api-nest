import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'pizza_id',
    example: '123-456-789',
  })
  pizza_id: string;

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
