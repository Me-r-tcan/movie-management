import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../movie/movie.entity';
import { Ticket } from '../ticket/ticket.entity';

@Entity()
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
}
