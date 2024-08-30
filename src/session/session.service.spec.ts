import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { UserRepository } from '../user/user.repository';
import { TicketService } from '../ticket/ticket.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Session } from './session.entity';
import { User } from '../user/user.entity';

describe('SessionService', () => {
  let sessionService: SessionService;
  let sessionRepository: Partial<Record<keyof SessionRepository, jest.Mock>>;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;
  let ticketService: Partial<Record<keyof TicketService, jest.Mock>>;

  beforeEach(async () => {
    sessionRepository = {
      findSessionWithMovie: jest.fn(),
      save: jest.fn(),
    };
    userRepository = {
      findById: jest.fn(),
      findOne: jest.fn(),
    };
    ticketService = {
      canWatch: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: SessionRepository, useValue: sessionRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: TicketService, useValue: ticketService },
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
  });

  describe('watchSession', () => {
    it('should throw NotFoundException if session does not exist', async () => {
      sessionRepository.findSessionWithMovie.mockResolvedValue(null);

      await expect(sessionService.watchSession(1, 1)).rejects.toThrow(NotFoundException);
      expect(sessionRepository.findSessionWithMovie).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if session has no associated movie', async () => {
      sessionRepository.findSessionWithMovie.mockResolvedValue({ movie: null });

      await expect(sessionService.watchSession(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have a valid ticket', async () => {
      sessionRepository.findSessionWithMovie.mockResolvedValue({ movie: {} });
      userRepository.findById.mockResolvedValue({});
      ticketService.canWatch.mockResolvedValue(false);

      await expect(sessionService.watchSession(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if user has already watched the session', async () => {
      const mockUser = { id: 1 };
      const mockSession = { movie: {}, watchedBy: [mockUser] };

      sessionRepository.findSessionWithMovie.mockResolvedValue(mockSession);
      userRepository.findById.mockResolvedValue(mockUser);
      ticketService.canWatch.mockResolvedValue(true);

      await expect(sessionService.watchSession(1, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should add user to watchedBy list and save session if all checks pass', async () => {
      const mockUser = { id: 1 };
      const mockSession = { movie: {}, watchedBy: [] };

      sessionRepository.findSessionWithMovie.mockResolvedValue(mockSession);
      userRepository.findById.mockResolvedValue(mockUser);
      ticketService.canWatch.mockResolvedValue(true);

      await sessionService.watchSession(1, 1);

      expect(mockSession.watchedBy).toContain(mockUser);
      expect(sessionRepository.save).toHaveBeenCalledWith(mockSession);
    });
  });

  describe('getUserWatchHistory', () => {
    it('should throw NotFoundException if user does not exist', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(sessionService.getUserWatchHistory(1)).rejects.toThrow(NotFoundException);
    });

    it('should return watched sessions of the user', async () => {
      const mockUser = { watchedSessions: [{ id: 1 }, { id: 2 }] };

      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await sessionService.getUserWatchHistory(1);

      expect(result).toEqual(mockUser.watchedSessions);
    });
  });
});
