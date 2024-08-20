import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    description: '订单状态',
    example: 'pending',
    enum: ['pending', 'finished'],
  })
  status: 'pending' | 'finished';

  @ApiProperty({
    description: '支付类型',
    example: 'alipay',
    enum: ['alipay', 'wechat'],
  })
  type: 'alipay' | 'wechat';
}
