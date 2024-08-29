import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { Session } from '../session/session.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MovieRepository extends Repository<Movie> {
  constructor(private dataSource: DataSource) {
    super(Movie, dataSource.createEntityManager());
  }

  async createMovie(movieData: CreateMovieDto): Promise<Movie> {
    const movie = this.create(movieData);
    return this.save(movie);
  }

  async findByMovieId(id: number): Promise<Movie | null> {
    return this.findOne({
        where: { id },
        relations: ['sessions'],
      });
  }

  async findAll(): Promise<Movie[] | null> {
    return this.find({ relations: ['sessions'] });
  }

  async updateMovie(id: number, updateData: UpdateMovieDto): Promise<Movie> {
    const { sessions, ...movieData } = updateData;

    await this.update(id, movieData);

    if (sessions) {
      const movie = await this.findByMovieId(id);
      if (movie) {
        movie.sessions = [];

        movie.sessions = sessions.map(session => {
          const newSession = new Session();
          Object.assign(newSession, session);
          return newSession;
        });

        await this.save(movie);
      }
    }

    return this.findByMovieId(id);
  }

  async deleteMovie(id: number): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Remove related sessions first
      await transactionalEntityManager.getRepository(Session).delete({ movie: { id } });

      // Then remove the movie
      await transactionalEntityManager.delete(Movie, id);
    });
  }
}
