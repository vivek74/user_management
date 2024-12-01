import { IsString, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
