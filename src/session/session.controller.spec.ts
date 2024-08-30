import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ForbiddenException } from '@nestjs/common';

describe('SessionController', () => {
  let sessionController: SessionController;
  let sessionService: Partial<Record<keyof SessionService, jest.Mock>>;

  beforeEach(async () => {
    sessionService = {
      watchSession: jest.fn(),
      getUserWatchHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [{ provide: SessionService, useValue: sessionService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    sessionController = module.get<SessionController>(SessionController);
  });

  describe('watchSession', () => {
    it('should call sessionService.watchSession with correct parameters', async () => {
      const req = { user: { id: 1 } };
      const sessionId = 1;

      await sessionController.watchSession(sessionId, req);

      expect(sessionService.watchSession).toHaveBeenCalledWith(req.user.id, sessionId);
    });

    it('should return success message when watchSession is called', async () => {
      const req = { user: { id: 1 } };
      const sessionId = 1;

      const result = await sessionController.watchSession(sessionId, req);

      expect(result).toEqual({ message: 'Session successfully marked as watched.' });
    });

    it('should throw ForbiddenException if watchSession throws ForbiddenException', async () => {
      const req = { user: { id: 1 } };
      const sessionId = 1;
      sessionService.watchSession.mockRejectedValue(new ForbiddenException('Forbidden'));

      await expect(sessionController.watchSession(sessionId, req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUserWatchHistory', () => {
    it('should call sessionService.getUserWatchHistory with correct parameters', async () => {
      const req = { user: { id: 1 } };

      await sessionController.getUserWatchHistory(req);

      expect(sessionService.getUserWatchHistory).toHaveBeenCalledWith(req.user.id);
    });

    it('should return user watch history', async () => {
      const req = { user: { id: 1 } };
      const mockWatchHistory = [{ id: 1 }, { id: 2 }];
      sessionService.getUserWatchHistory.mockResolvedValue(mockWatchHistory);

      const result = await sessionController.getUserWatchHistory(req);

      expect(result).toEqual(mockWatchHistory);
    });
  });
});
