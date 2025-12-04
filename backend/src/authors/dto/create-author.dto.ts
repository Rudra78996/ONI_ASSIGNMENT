import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.K. Rowling' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'British author, best known for the Harry Potter series' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ example: '1965-07-31' })
  @IsDateString()
  @IsOptional()
  birthDate?: string;
}
