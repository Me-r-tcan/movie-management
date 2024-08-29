// auth.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '60m' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        ConfigService,
        JwtStrategy,
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const userData = { username: 'testuser', password: 'password123', age: 21 };
      const result = { id: 1, ...userData };
      jest.spyOn(authService, 'register').mockResolvedValue(result as any);

      expect(await authController.register(userData)).toEqual(result);
    });

    it('should throw a ConflictException if user already exists', async () => {
      const userData = { username: 'testuser', password: 'password123', age: 21 };
      jest.spyOn(authService, 'register').mockRejectedValue(new ConflictException());

      await expect(authController.register(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should successfully log in and return a token', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      const result = { access_token: 'jwt-token' };
      jest.spyOn(authService, 'login').mockResolvedValue(result as any);

      expect(await authController.login(userData)).toEqual(result);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const userData = { username: 'testuser', password: 'password123' };
      jest.spyOn(authService, 'login').mockRejectedValue(new UnauthorizedException());

      await expect(authController.login(userData)).rejects.toThrow(UnauthorizedException);
    });
  });
});
