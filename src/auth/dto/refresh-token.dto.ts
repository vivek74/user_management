import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'jwt',
    description: 'Enter refresh token',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
