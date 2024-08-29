import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Movie } from '../movie/movie.entity';

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

  @ManyToOne(() => Movie, movie => movie.sessions, { onDelete: 'CASCADE' })
  movie: Movie;
}
