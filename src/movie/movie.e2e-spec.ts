import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { User, UserRole } from '../user/user.entity';
import { Session } from '../session/session.entity';

describe('MovieService (e2e)', () => {
  let app: INestApplication;
  let movieRepository: Repository<Movie>;
  let userRepository: Repository<User>;
  let sessionRepository: Repository<Session>;
  let dataSource: DataSource;
  const password = 'password123';
  const session = [
    {
      id: 6,
      date: "2024-08-30",
      timeSlot: "10.00-12.00",
      roomNumber: 1
    }
  ]
  let accessToken: string;
  let customerAccessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([Movie, User, Session]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    movieRepository = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    sessionRepository = moduleFixture.get<Repository<Session>>(getRepositoryToken(Session));
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE "ticket" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "session" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE "movie" RESTART IDENTITY CASCADE');

    const managerUser = await createUser('manager_user', 30, UserRole.MANAGER);
    accessToken = await loginUser(managerUser.username);

    const customerUser = await createUser('customer_user', 25, UserRole.CUSTOMER);
    customerAccessToken = await loginUser(customerUser.username);
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

  const createSession = async (movie: Movie, date: string, timeSlot: string, roomNumber: number): Promise<Session> => {
    const session = await sessionRepository.save({ movie, date, timeSlot, roomNumber });
    expect(session).toHaveProperty('id');
    return session;
  };

  const createMovie = async (name: string, ageRestriction: number, sessions?: any): Promise<Movie> => {
    const createMovieDto: CreateMovieDto = { name, ageRestriction, sessions };
    const movieResponse = await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createMovieDto);

    expect(movieResponse.status).toBe(201);
    expect(movieResponse.body).toHaveProperty('id');
    return movieResponse.body;
  };

  describe('Manager role permissions', () => {
    describe('/movies (POST) create', () => {
      it('should create a new movie with sessions', async () => {
        const movieName = 'Test Movie';
        const ageRestriction = 18;

        const movie = await createMovie(movieName, ageRestriction, session);
        const updateMovieDto: UpdateMovieDto = { name: movieName, ageRestriction, sessions: session};

        const response = await request(app.getHttpServer())
          .patch(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateMovieDto);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe(movieName);
        expect(response.body.ageRestriction).toBe(ageRestriction);
        expect(response.body.sessions).toHaveLength(1);
      });
    });

    describe('/movies/:id (PATCH) update', () => {
      it('should update a movie with sessions', async () => {
        const movie = await createMovie('Original Movie', 15, session);
        const updateMovieDto: UpdateMovieDto = { name: 'Updated Movie', ageRestriction: 18, sessions: session};

        const response = await request(app.getHttpServer())
          .patch(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateMovieDto);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', movie.id);
        expect(response.body.name).toBe('Updated Movie');
        expect(response.body.ageRestriction).toBe(18);
        expect(response.body.sessions).toHaveLength(1);
      });
    });

    describe('/movies/:id (DELETE) remove', () => {
      it('should delete a movie', async () => {
        const movie = await createMovie('Movie to Delete', 18, session);

        await request(app.getHttpServer())
          .delete(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        const response = await request(app.getHttpServer())
          .get(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404);

        expect(response.body.message).toBe(`Movie with ID ${movie.id} not found`);
      });
    });
  });

  describe('Customer role restrictions', () => {
    describe('/movies (POST) create', () => {
      it('should not allow a customer to create a movie', async () => {
        const movieName = 'Unauthorized Movie';
        const ageRestriction = 18;
        const movie = await createMovie(movieName, ageRestriction, session);

        const response = await request(app.getHttpServer())
          .post('/movies')
          .set('Authorization', `Bearer ${customerAccessToken}`)
          .send(movie);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden resource');
      });
    });

    describe('/movies/:id (PATCH) update', () => {
      it('should not allow a customer to update a movie', async () => {
        const movie = await createMovie('Movie for Customer', 15, session);
        const updateMovieDto: UpdateMovieDto = { name: 'Unauthorized Update', ageRestriction: 18, sessions:session };

        const response = await request(app.getHttpServer())
          .patch(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${customerAccessToken}`)
          .send(updateMovieDto);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden resource');
      });
    });

    describe('/movies/:id (DELETE) remove', () => {
      it('should not allow a customer to delete a movie', async () => {
        const movie = await createMovie('Movie for Customer to Delete', 18, session);

        const response = await request(app.getHttpServer())
          .delete(`/movies/${movie.id}`)
          .set('Authorization', `Bearer ${customerAccessToken}`)
          .expect(403);

        expect(response.body.message).toBe('Forbidden resource');
      });
    });
  });
});
