import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentDto {
  @ApiProperty({
    example: 'My Document',
    description: 'The title of the document',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'This is a sample document',
    description: 'A brief description of the document',
    required: false,
    type: 'string',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
