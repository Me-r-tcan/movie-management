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
}
