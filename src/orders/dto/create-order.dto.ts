import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: '用户姓名',
    example: '悟空',
  })
  name: string;

  @ApiProperty({
    description: '用户电话',
    example: '12345678901',
  })
  phone: string;

  @ApiProperty({
    description: '用户地址',
    example: '花果山',
  })
  address: string;
}
