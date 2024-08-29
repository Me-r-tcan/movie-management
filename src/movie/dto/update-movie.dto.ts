import { IsArray, ValidateNested } from 'class-validator';
import { CreateMovieDto } from './create-movie.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateSessionDto } from '../../session/dto/create-session.dto';
import { Type } from 'class-transformer';

export class UpdateMovieDto extends PartialType(CreateMovieDto) {
  @ApiPropertyOptional({ description: 'The name of the movie', example: 'Inception' })
  name?: string;

  @ApiPropertyOptional({ description: 'Age restriction for the movie', example: 16 })
  ageRestriction?: number;

  @ApiPropertyOptional({
    description: 'List of session details for the movie',
    example: [
      { date: '2024-08-30', timeSlot: '10.00-12.00', roomNumber: 1 },
      { date: '2024-08-30', timeSlot: '12.00-14.00', roomNumber: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions?: CreateSessionDto[];
}
