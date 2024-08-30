import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import { Session } from '../session/session.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TicketRepository extends Repository<Ticket> {
  constructor(private dataSource: DataSource) {
    super(Ticket, dataSource.createEntityManager());
  }

  async createTicket(user: User, session: Session): Promise<Ticket> {
    const ticket = new Ticket();
    ticket.user = user;
    ticket.session = session;
    ticket.purchaseDate = new Date().toISOString();  
    return this.save(ticket);
  }

  async findTicketsByUser(userId: number): Promise<Ticket[]> {
    return this.find({
      where: { user: { id: userId } },
      relations: ['session', 'session.movie'],
    });
  }

  async findTicketById(id: number): Promise<Ticket | null> {
    return this.findOne({
      where: { id },
      relations: ['user', 'session', 'session.movie'],
    });
  }
}
