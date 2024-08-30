import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User, UserRole } from '../user/user.entity';
import { Session } from '../session/session.entity';
import { Ticket } from '../ticket/ticket.entity';
import { Movie } from '../movie/movie.entity';

describe('TicketService (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let sessionRepository: Repository<Session>;
  let ticketRepository: Repository<Ticket>;
  let movieRepository: Repository<Movie>;
  let dataSource: DataSource;
  const password = 'password123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([User, Session, Ticket, Movie]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    sessionRepository = moduleFixture.get<Repository<Session>>(getRepositoryToken(Session));
    ticketRepository = moduleFixture.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    movieRepository = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "ticket" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "session" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "movie" RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  const createUser = async (username: string, age: number, role: string) => {
    const registerReq = await request(app.getHttpServer())
    .post(`/auth/register`)
    .send({ username, password, age, role });

    return registerReq.body;
  };

  const loginUser = async (username: string) => {
    const loginReq = await request(app.getHttpServer())
    .post(`/auth/login`)
    .send({ username, password });

    return loginReq.body.access_token;
  };

  const createMovie = async (name: string, ageRestriction: number = 18): Promise<Movie> => {
    return movieRepository.save({ name, ageRestriction });
  };

  const createSession = async (movie: Movie): Promise<Session> => {
    return sessionRepository.save({
      date: '2024-09-01',
      timeSlot: '18:00',
      roomNumber: 1,
      movie,
    });
  };

  describe('/tickets (POST) buyTicket', () => {
    let user: User;
    let session: Session;
    let movie: Movie;
    let accessToken: string;

    beforeEach(async () => {
      user = await createUser("test_user", 25, UserRole.CUSTOMER);
      accessToken = await loginUser(user.username);
      movie = await createMovie('Test Movie');
      session = await createSession(movie);
    });

    it('should buy a ticket for the user', async () => {
      const response = await request(app.getHttpServer())
        .post(`/tickets/${session.id}/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ user });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.user.id).toBe(user.id);
      expect(response.body.session.id).toBe(session.id);
    });

    it('should throw NotFoundException if session does not exist', async () => {
      const invalidSessionId = 9999; 
      const response = await request(app.getHttpServer())
        .post(`/tickets/${invalidSessionId}/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ user });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(`Session with ID ${invalidSessionId} not found`);
    });

    it('should throw ForbiddenException if user does not meet age restriction', async () => {
      const underageUser = await createUser(`underageuser`, 15, UserRole.CUSTOMER);
      accessToken = await loginUser(underageUser.username);

      const response = await request(app.getHttpServer())
        .post(`/tickets/${session.id}/buy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ user: underageUser });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not meet the age restriction for this movie');
    });
  });
});
