import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'e0169a2c-1509-4050-9195-1fa30062ff97',
  })
  id: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: '********',
    minLength: 6, // 假设密码最小长度为6
  })
  password: string;

  @ApiProperty({
    description: 'Name of the user',
    example: '即刻披萨Bot',
  })
  name: string;

  @ApiProperty({
    description: 'Address of the user',
    example: '东胜神洲/傲来国/花果山福地/水帘洞',
  })
  address: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '7758258',
  })
  phone: string;

  @ApiProperty({
    description: 'Timestamp of user creation',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Timestamp of the last update',
  })
  updated_at: Date;
}
