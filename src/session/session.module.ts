import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { UserRepository } from '../user/user.repository';
import { TicketService } from '../ticket/ticket.service';
import { TicketRepository } from '../ticket/ticket.repository';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository, UserRepository, TicketService, TicketRepository],
})
export class SessionModule {}
