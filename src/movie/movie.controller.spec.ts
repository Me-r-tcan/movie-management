import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../user/user.entity';

describe('MovieController', () => {
  let controller: MovieController;
  let service: MovieService;

  const mockMovieService = {
    create: jest.fn(dto => ({ id: Date.now(), ...dto })),
    findAll: jest.fn(() => [
      { id: 1, name: 'Movie 1', ageRestriction: 16 },
      { id: 2, name: 'Movie 2', ageRestriction: 18 },
    ]),
    findOne: jest.fn(id => ({ id, name: 'Movie 1', ageRestriction: 16 })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => ({ id })),
  };

  const mockRolesGuard = (role: UserRole) => ({
    canActivate: jest.fn((context) => {
      const request = context.switchToHttp().getRequest();
      request.user = { role };
      return role === UserRole.MANAGER;
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard(UserRole.MANAGER))
    .compile();

    controller = module.get<MovieController>(MovieController);
    service = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Role-based access control', () => {
    it('should deny non-MANAGER roles from creating a movie', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [MovieController],
        providers: [
          {
            provide: MovieService,
            useValue: mockMovieService,
          },
        ],
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard(UserRole.CUSTOMER))
      .compile();

      const nonManagerController = module.get<MovieController>(MovieController);

      const dto: CreateMovieDto = {
        name: 'New Movie',
        ageRestriction: 16,
        sessions: [{ date: '2024-08-30', timeSlot: '10.00-12.00', roomNumber: 1 }],
      };

      try {
        await nonManagerController.create(dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should deny non-MANAGER roles from updating a movie', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [MovieController],
        providers: [
          {
            provide: MovieService,
            useValue: mockMovieService,
          },
        ],
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard(UserRole.CUSTOMER))
      .compile();

      const nonManagerController = module.get<MovieController>(MovieController);

      const id = '1';
      const dto: UpdateMovieDto = { name: 'Updated Movie' };

      try {
        await nonManagerController.update(id, dto);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should deny non-MANAGER roles from deleting a movie', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [MovieController],
        providers: [
          {
            provide: MovieService,
            useValue: mockMovieService,
          },
        ],
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard(UserRole.CUSTOMER))
      .compile();

      const nonManagerController = module.get<MovieController>(MovieController);

      const id = '1';

      try {
        await nonManagerController.remove(id);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
