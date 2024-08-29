import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MovieRepository } from './movie.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './movie.entity';

describe('MovieService', () => {
  let service: MovieService;
  let repository: MovieRepository;

  const mockMovieRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findAll: jest.fn(),
    findByMovieId: jest.fn(),
    updateMovie: jest.fn(),
    deleteMovie: jest.fn(),
  };

  const mockMovie: Movie = {
    id: 1,
    name: 'Inception',
    ageRestriction: 13,
    sessions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: mockMovieRepository,
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    repository = module.get<MovieRepository>(MovieRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = {
      	name: 'Test Movie',
        ageRestriction: 18,
        sessions: [{
          date: "2024-08-30",
          timeSlot: "16.00-18.00",
          roomNumber: 3
        }]
      };
      mockMovieRepository.create.mockReturnValue(mockMovie);
      mockMovieRepository.save.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);

      expect(mockMovieRepository.create).toHaveBeenCalledWith(createMovieDto);
      expect(mockMovieRepository.save).toHaveBeenCalledWith(mockMovie);
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockMovieRepository.findAll.mockResolvedValue([mockMovie]);

      const result = await service.findAll();

      expect(mockMovieRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockMovie]);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      mockMovieRepository.findByMovieId.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);

      expect(mockMovieRepository.findByMovieId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw a NotFoundException if movie is not found', async () => {
      mockMovieRepository.findByMovieId.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updateMovieDto: UpdateMovieDto = { name: 'Updated Movie', ageRestriction: 15 };
      mockMovieRepository.updateMovie.mockResolvedValue(undefined);
      mockMovieRepository.findByMovieId.mockResolvedValue({ ...mockMovie, ...updateMovieDto });

      const result = await service.update(1, updateMovieDto);

      expect(mockMovieRepository.updateMovie).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result.name).toEqual('Updated Movie');
      expect(result.ageRestriction).toEqual(15);
    });

    it('should throw a NotFoundException if movie is not found during update', async () => {
      mockMovieRepository.updateMovie.mockResolvedValue(undefined);
      mockMovieRepository.findByMovieId.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a movie by ID', async () => {
      mockMovieRepository.deleteMovie.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockMovieRepository.deleteMovie).toHaveBeenCalledWith(1);
    });
  });
});
