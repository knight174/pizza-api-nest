import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';
import { CreatePizzaDto, PizzaTag } from './create-pizza.dto';

export class UpdatePizzaDto extends PartialType(CreatePizzaDto) {
  // PartialType 会自动将 CreatePizzaDto 的所有属性设为可选
  // 并继承其校验器。
  // 对于需要覆盖或特殊处理的字段，可以在这里重新声明并添加 @IsOptional()

  @ApiProperty({
    description: '披萨的名称 (可选)',
    example: '超级至尊玛格丽特',
    required: false,
  })
  @IsOptional() // 明确表示可选
  @IsString()
  @IsNotEmpty() // 如果提供了值，则不能为空字符串
  name?: string;

  @ApiProperty({
    description: '披萨的价格 (字符串格式，可选)',
    example: '12.99',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: '价格必须是有效的数字格式，最多两位小数',
  })
  price?: string;

  @ApiProperty({
    description: '披萨的折扣 (字符串格式，可选)',
    example: '0.10',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: '折扣必须是有效的数字格式，最多两位小数',
  })
  discount?: string;

  @ApiProperty({
    description: '披萨的销量 (可选)',
    example: 200,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  sales?: number;

  @ApiProperty({
    description: '披萨的尺寸 (可选)',
    example: 14,
    type: Number,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(6)
  size?: number;

  @ApiProperty({
    description: '披萨的标签 (可选)',
    example: PizzaTag.NEW,
    enum: PizzaTag,
    required: false,
  })
  @IsOptional()
  @IsEnum(PizzaTag, {
    message: `标签必须是预定义的类型之一: ${Object.values(PizzaTag).join(', ')}`,
  })
  tag?: PizzaTag;

  @ApiProperty({
    description: '披萨图片的 URL 地址 (可选)',
    example: 'https://example.com/new_pizza.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: '图片地址必须是有效的 URL' })
  @IsString()
  src?: string;
}
