import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, Index } from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Ticket } from '../ticket/ticket.entity';
import { User } from '../user/user.entity';

@Entity()
@Index('idx_session_date_time', ['date', 'timeSlot'])
@Index('idx_session_room_number', ['roomNumber'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  timeSlot: string;

  @Column()
  roomNumber: number;

  @ManyToOne(() => Movie, (movie) => movie.sessions, { onDelete: 'CASCADE' })
  movie: Movie;

  @OneToMany(() => Ticket, (ticket) => ticket.session)
  tickets: Ticket[];

  @ManyToMany(() => User, user => user.watchedSessions)
  @JoinTable()
  watchedBy: User[];
}
