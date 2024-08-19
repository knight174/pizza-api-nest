import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  name?: string;
  @ApiProperty({ required: false })
  address?: string;
  @ApiProperty({ required: false })
  phone?: string;
}
