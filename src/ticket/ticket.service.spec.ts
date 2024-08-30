import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from './ticket.repository';
import { SessionRepository } from '../session/session.repository';
import { UserRepository } from '../user/user.repository';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User, UserRole } from '../user/user.entity';
import { Session } from '../session/session.entity';
import { Ticket } from './ticket.entity';

describe('TicketService', () => {
  let service: TicketService;

  const mockTicketRepository = {
    createTicket: jest.fn((user, session) => ({
      id: Date.now(),
      user,
      session,
      purchaseDate: new Date().toISOString(),
    })),
    findOne: jest.fn(({ where }) => {
      if (where.user.id === 1 && where.session.id === 1) {
        return {
          id: 1,
          user: { id: 1 },
          session: { id: 1 },
          purchaseDate: new Date().toISOString(),
        } as Ticket;
      }
      return null;
    }),
  };

  const mockSessionRepository = {
    findSessionWithMovie: jest.fn((id) => {
      if (id === 1) {
        return {
          id: 1,
          date: '2024-08-30',
          timeSlot: '10.00-12.00',
          roomNumber: 1,
          movie: { id: 2, ageRestriction: 16 },
        } as Session;
      }
      return null;
    }),
  };

  const mockUserRepository = {
    findByUsername: jest.fn((username) => {
      if (username === 'john_doe') {
        return {
          id: 1,
          username: 'john_doe',
          password: 'hashed_password',
          age: 18,
          role: UserRole.CUSTOMER,
          tickets: [],
          watchedSessions:[]
        } as User;
      }
      return null;
    }),
    findById: jest.fn((id) => {
      if (id === 1) {
        return {
          id: 1,
          username: 'john_doe',
          password: 'hashed_password',
          age: 18,
          role: UserRole.CUSTOMER,
          tickets: [],
          watchedSessions:[]
        } as User;
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: TicketRepository, useValue: mockTicketRepository },
        { provide: SessionRepository, useValue: mockSessionRepository },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buyTicket', () => {
    it('should successfully buy a ticket', async () => {
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashed_password',
        age: 18,
        role: UserRole.CUSTOMER,
        tickets: [],
        watchedSessions:[]
      };
      const sessionId = 1;

      const result = await service.buyTicket(user, sessionId);

      expect(mockSessionRepository.findSessionWithMovie).toHaveBeenCalledWith(sessionId);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledWith(user.username);
      expect(mockTicketRepository.createTicket).toHaveBeenCalledWith(user, {
        id: 1,
        date: '2024-08-30',
        timeSlot: '10.00-12.00',
        roomNumber: 1,
        movie: { id: 2, ageRestriction: 16 },
      });
      expect(result).toEqual({
        id: expect.any(Number),
        user,
        session: {
          id: 1,
          date: '2024-08-30',
          timeSlot: '10.00-12.00',
          roomNumber: 1,
          movie: { id: 2, ageRestriction: 16 },
        },
        purchaseDate: expect.any(String),
      });
    });

    it('should throw NotFoundException if session is not found', async () => {
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashed_password',
        age: 18,
        role: UserRole.CUSTOMER,
        tickets: [],
        watchedSessions:[]
      };
      const sessionId = 999;

      try {
        await service.buyTicket(user, sessionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Session with ID ${sessionId} not found`);
      }
    });

    it('should throw NotFoundException if movie is not found', async () => {
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashed_password',
        age: 18,
        role: UserRole.CUSTOMER,
        tickets: [],
        watchedSessions:[]
      };
      const sessionId = 2;

      try {
        await service.buyTicket(user, sessionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toEqual(`Session with ID ${sessionId} not found`);
      }
    });

    it('should throw ForbiddenException if user does not meet age restriction', async () => {
      const user: User = {
        id: 1,
        username: 'john_doe',
        password: 'hashed_password',
        age: 15,
        role: UserRole.CUSTOMER,
        tickets: [],
        watchedSessions:[]
      };
      const sessionId = 1;

      try {
        await service.buyTicket(user, sessionId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toEqual(`You do not meet the age restriction for this movie`);
      }
    });
  });

  describe('canWatch', () => {
    it('should return true if user has a ticket for the session', async () => {
      const userId = 1;
      const sessionId = 1;

      const result = await service.canWatch(userId, sessionId);

      expect(mockTicketRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, session: { id: sessionId } },
      });
      expect(result).toBe(true);
    });

    it('should return false if user does not have a ticket for the session', async () => {
      const userId = 1;
      const sessionId = 2;

      const result = await service.canWatch(userId, sessionId);

      expect(mockTicketRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: userId }, session: { id: sessionId } },
      });
      expect(result).toBe(false);
    });
  });
});
