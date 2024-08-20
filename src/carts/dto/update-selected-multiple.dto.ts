import { ApiProperty } from '@nestjs/swagger';

export class updateSelectedMultipleDto {
  @ApiProperty({
    isArray: true,
    description: '需要更新被选中状态的购物车项的id数组',
    example: ['1', '2', '3'],
  })
  ids: string[];

  @ApiProperty({
    description: '是否被选中',
    example: true,
  })
  selected: boolean;
}
