import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User, UserRole } from '../user/user.entity';
import { Session } from '../session/session.entity';
import { Ticket } from '../ticket/ticket.entity';
import { CreateMovieDto } from '../movie/dto/create-movie.dto';
import { Movie } from 'src/movie/movie.entity';

describe('SessionService (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let sessionRepository: Repository<Session>;
  let ticketRepository: Repository<Ticket>;
  let dataSource: DataSource;
  const password = 'password123';
  let accessToken: string;
  let customerAccessToken: string;
  let movie: Movie;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([User, Session, Ticket]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    sessionRepository = moduleFixture.get<Repository<Session>>(getRepositoryToken(Session));
    ticketRepository = moduleFixture.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "ticket" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "session" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');

    const managerUser = await createUser('manager_user', 30, UserRole.MANAGER);
    accessToken = await loginUser(managerUser.username);

    const customerUser = await createUser('customer_user', 25, UserRole.CUSTOMER);
    customerAccessToken = await loginUser(customerUser.username);

    movie = await createMovie("inception", 16);
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

  const createMovie = async (name: string, ageRestriction: number, sessions?: any): Promise<Movie> => {
    const createMovieDto: CreateMovieDto = { name, ageRestriction, sessions: [
			{
				date: "2024-08-30",
				timeSlot: "10.00-12.00",
				roomNumber: 1
			}
		]
	 };
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createMovieDto);

    expect(movieResponse.status).toBe(201);
    expect(movieResponse.body).toHaveProperty('id');
    return movieResponse.body;
  };

  describe('watchSession', () => {
    it('should allow a customer to watch a session with a valid ticket', async () => {
      const ticketResponse = await request(app.getHttpServer())
        .post(`/tickets/${movie.sessions[0].id}/buy`)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({ userId: 2 });
	
      expect(ticketResponse.status).toBe(201);

      const watchResponse = await request(app.getHttpServer())
        .post(`/sessions/${movie.sessions[0].id}/watch`)
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(watchResponse.status).toBe(201);
    });

    it('should not allow a customer to watch a session without a valid ticket', async () => {
      const watchResponse = await request(app.getHttpServer())
        .post(`/sessions/${movie.sessions[0].id}/watch`)
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(watchResponse.status).toBe(403);
      expect(watchResponse.body.message).toBe('User has not valid ticket.');
    });

    it('should not allow a customer to watch the same session twice', async () => {
      const ticketResponse = await request(app.getHttpServer())
        .post(`/tickets/${movie.sessions[0].id}/buy`)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .send({ userId: 2 });

      expect(ticketResponse.status).toBe(201);

      await request(app.getHttpServer())
        .post(`/sessions/${movie.sessions[0].id}/watch`)
        .set('Authorization', `Bearer ${customerAccessToken}`)
        .expect(201);

      const watchResponse = await request(app.getHttpServer())
        .post(`/sessions/${movie.sessions[0].id}/watch`)
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(watchResponse.status).toBe(403);
      expect(watchResponse.body.message).toBe('User has already watched this session');
    });
  });

  describe('getUserWatchHistory', () => {
    it('should return the watch history of a customer', async () => {
      const watchHistoryResponse = await request(app.getHttpServer())
        .get(`/sessions/history`)
        .set('Authorization', `Bearer ${customerAccessToken}`);

      expect(watchHistoryResponse.status).toBe(200);
      expect(Array.isArray(watchHistoryResponse.body)).toBe(true);
    });
  });
});
