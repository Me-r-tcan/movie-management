import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionRepository extends Repository<Session> {
  constructor(private dataSource: DataSource) {
    super(Session, dataSource.createEntityManager());
  }

  async findSessionWithMovie(sessionId: number): Promise<Session | null> {
    return this.findOne({
      where: { id: sessionId },
      relations: ['movie'],
    });
  }

  async findSessionWithMovieWithWatchedBy(sessionId: number): Promise<Session | null> {
    return this.findOne({
      where: { id: sessionId },
      relations: ['movie', 'watchedBy'],
    });
  }

  async findSessionsByMovie(movieId: number): Promise<Session[]> {
    return this.find({
      where: { movie: { id: movieId } },
      relations: ['movie'],
    });
  }
}
