import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SessionRepository } from '../session/session.repository';
import { TicketRepository } from './ticket.repository';
import { User } from '../user/user.entity';
import { Ticket } from './ticket.entity';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class TicketService {
  constructor(
    private ticketRepository: TicketRepository,
    private sessionRepository: SessionRepository,
    private userRepository: UserRepository,
  ) {}

  async buyTicket(user: User, sessionId: number): Promise<Ticket> {
    const session = await this.sessionRepository.findSessionWithMovie(sessionId);

    if (!session) {
      throw new NotFoundException(`Session with ID ${sessionId} not found`);
    }

		if (!session.movie) {
      throw new NotFoundException(`Movie with session ID ${sessionId} not found`);
    }

    if (user.age < session.movie.ageRestriction) {
      throw new ForbiddenException(`You do not meet the age restriction for this movie`);
    }

    const dbUser = await this.userRepository.findByUsername(user.username);

    return this.ticketRepository.createTicket(dbUser, session);
  }

  async canWatch(userId: number, sessionId: number): Promise<boolean> {
    const ticket = await this.ticketRepository.findOne({
      where: { user: { id: userId }, session: { id: sessionId } },
    });

    if (!ticket) {
      return false;
    }

    return true;
  }
}
