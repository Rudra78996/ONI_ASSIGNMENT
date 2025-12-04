import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: "Harry Potter and the Philosopher's Stone" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: '9780747532699' })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiPropertyOptional({ example: 'First book in the Harry Potter series' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '1997-06-26' })
  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  @IsNotEmpty()
  authorId: string;
}
