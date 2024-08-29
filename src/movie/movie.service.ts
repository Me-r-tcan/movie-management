import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieRepository } from './movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
  ) {}

  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const movie = this.movieRepository.create(createMovieDto);
    return this.movieRepository.save(movie);
  }

  findAll(): Promise<Movie[]> {
    return this.movieRepository.findAll();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findByMovieId(id);
  
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    
    return movie;
  }
  

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.movieRepository.updateMovie(id, updateMovieDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    return this.movieRepository.deleteMovie(id);
  }
}
