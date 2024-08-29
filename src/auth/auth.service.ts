import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRepository } from '../user/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(userData: RegisterDto): Promise<User> {
    const user = await this.userRepository.findByUsername(userData.username);

    if(user){
      throw new ConflictException(`"User with username ${userData.username} already exists"`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.userRepository.createUser({ ...userData, password: hashedPassword });
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: LoginDto) {
    const validatedUser = await this.validateUser(user.username, user.password);

    if(!validatedUser){
      throw new UnauthorizedException();
    }
    
    const payload = { username: validatedUser.username, sub: validatedUser.id, role: validatedUser.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
