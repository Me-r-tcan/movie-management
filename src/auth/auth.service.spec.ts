import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByUsername: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const userData = { username: 'test', password: 'password123', age: 21 };
      userRepository.findByUsername = jest.fn().mockResolvedValue(null);
      userRepository.createUser = jest.fn().mockResolvedValue(userData);
      const result = await service.register(userData);

      expect(result).toEqual(userData);
      expect(userRepository.findByUsername).toHaveBeenCalledWith('test');
      expect(userRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: expect.any(String),
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const userData = { username: 'test', password: 'password123', age: 21 };
      userRepository.findByUsername = jest.fn().mockResolvedValue(userData);

      await expect(service.register(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access token for valid user', async () => {
      const user = { username: 'test', password: 'password123', id: 1, role: 'user' };
      const payload = { username: 'test', sub: 1, role: 'user' };
      userRepository.findByUsername = jest.fn().mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      const result = await service.login({ username: 'test', password: 'password123' });

      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(userRepository.findByUsername).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password);
      expect(jwtService.sign).toHaveBeenCalledWith(payload);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      userRepository.findByUsername = jest.fn().mockResolvedValue(null);

      await expect(service.login({ username: 'test', password: 'password123' })).rejects.toThrow(UnauthorizedException);
    });
  });
});