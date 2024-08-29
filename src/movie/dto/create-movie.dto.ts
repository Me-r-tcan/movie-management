import { IsString, IsInt, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSessionDto } from '../../session/dto/create-session.dto';
import { Type } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({ description: 'The name of the movie', example: 'Inception' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Age restriction for the movie', example: 16 })
  @IsInt()
  ageRestriction: number;

  @ApiProperty({
    description: 'List of session details for the movie',
    example: [
      { date: '2024-08-30', timeSlot: '10.00-12.00', roomNumber: 1 },
      { date: '2024-08-30', timeSlot: '12.00-14.00', roomNumber: 2 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionDto)
  sessions: CreateSessionDto[];
}
