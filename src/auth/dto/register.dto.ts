import { IsString, IsNotEmpty, IsEnum, IsInt, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../user/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'john_doe', description: 'The username of the user' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'strongPassword123', description: 'The password of the user' })
  password: string;

  @IsInt()
  @Min(0)
  @Max(120)
  @ApiProperty({ example: 28, description: 'The age of the user' })
  age: number;

  @IsOptional() 
  @IsEnum(UserRole)
  @ApiProperty({ example: UserRole.CUSTOMER, description: 'The role of the user' })
  role?: UserRole = UserRole.CUSTOMER;
}
