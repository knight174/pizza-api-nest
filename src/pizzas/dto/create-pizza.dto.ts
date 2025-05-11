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

// 定义 tag 的枚举类型，用于校验和代码提示
export enum PizzaTag {
  DISCOUNT = 'discount',
  CLASSIC = 'classic',
  SET = 'set',
  NEW = 'new', // 可以添加更多类型
  // ... 其他你想支持的 tag
}

export class CreatePizzaDto {
  @ApiProperty({
    description: '披萨的名称',
    example: '玛格丽特',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: '披萨的价格 (字符串格式，例如 "9.99")',
    example: '9.99', // 示例改为字符串
    type: String, // Swagger 类型提示
  })
  @IsString() // Drizzle decimal 通常接收字符串
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    // 正则表达式校验 xx.xx 格式的数字字符串
    message: '价格必须是有效的数字格式，最多两位小数 (例如: 10.99 或 10)',
  })
  price: string; // 类型改为 string

  @ApiProperty({
    description: '披萨的折扣 (字符串格式，例如 "0.20" 表示20%)',
    example: '0.20', // 示例改为字符串
    type: String, // Swagger 类型提示
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    // 与 price 类似的校验
    message: '折扣必须是有效的数字格式，最多两位小数 (例如: 0.15 或 0.2)',
  })
  discount: string; // 类型改为 string

  @ApiProperty({
    description: '披萨的销量',
    example: 150,
    type: Number,
  })
  @IsInt() // 确保是整数
  @Min(0) // 最小值为0
  sales: number;

  @ApiProperty({
    description: '披萨的尺寸 (例如英寸)',
    example: 12,
    type: Number,
  })
  @IsInt()
  @Min(6) // 假设最小尺寸为6
  size: number;

  @ApiProperty({
    description: '披萨的标签',
    example: PizzaTag.DISCOUNT,
    enum: PizzaTag, // 使用定义的枚举
  })
  @IsEnum(PizzaTag, {
    message: `标签必须是预定义的类型之一: ${Object.values(PizzaTag).join(', ')}`,
  })
  @IsNotEmpty()
  tag: PizzaTag; // 类型可以使用枚举

  @ApiProperty({
    description: '披萨图片的 URL 地址',
    example: 'https://example.com/pizza.jpg',
    required: false, // Swagger 提示
  })
  @IsOptional() // 允许该字段缺失
  @IsUrl({}, { message: '图片地址必须是有效的 URL' })
  @IsString()
  src?: string;
}
