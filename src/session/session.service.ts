import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { UserRepository } from '../user/user.repository';
import { Session } from './session.entity';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
    private readonly ticketService: TicketService,
  ) {}

  async watchSession(userId: number, sessionId: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    const session = await this.sessionRepository.findSessionWithMovieWithWatchedBy(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

    if (!session.movie) {
      throw new NotFoundException(`Movie with session ID ${sessionId} not found`);
    }

    const canCustomerWatch = await this.ticketService.canWatch(userId, sessionId);

    if(!canCustomerWatch) {
        throw new ForbiddenException('User has not valid ticket.');
    }

    // Initialize watchedBy if it's undefined
    if (!session.watchedBy) {
      session.watchedBy = [];
    }

    // Check if the user has already watched this session
    if (session.watchedBy.some((watchedUser) => watchedUser.id === userId)) {
      throw new ForbiddenException('User has already watched this session');
    }

    // Add user to watchedBy list
    session.watchedBy.push(user);
    await this.sessionRepository.save(session);
  }

  async getUserWatchHistory(userId: number): Promise<Session[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['watchedSessions'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.watchedSessions;
  }
}
