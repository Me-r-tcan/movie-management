import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TicketRepository } from './ticket.repository';
import { SessionRepository } from 'src/session/session.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  controllers: [TicketController],
  providers: [TicketService, TicketRepository, SessionRepository, UserRepository],
})
export class TicketModule {}
