import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The unique email of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name?: string;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, Anytown, AN',
  })
  address?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '1234567890',
  })
  phone?: string;
}
