import { IsString, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({ description: 'The date of the session', example: '2024-08-30' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'The time slot of the session', example: '10.00-12.00' })
  @IsString()
  timeSlot: string;

  @ApiProperty({ description: 'The room number for the session', example: 1 })
  @IsInt()
  roomNumber: number;
}
