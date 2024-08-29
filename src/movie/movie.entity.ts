import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Session } from '../session/session.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ageRestriction: number;

  @OneToMany(() => Session, (session) => session.movie, { cascade: true })
  sessions: Session[];
}
