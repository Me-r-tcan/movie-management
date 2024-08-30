import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { UserRole } from '../user/user.entity';

describe('TicketController', () => {
  let controller: TicketController;
  let service: TicketService;

  const mockTicketService = {
    buyTicket: jest.fn((user, sessionId) => ({
      id: Date.now(),
      user,
      sessionId,
      purchaseDate: new Date().toISOString(),
    })),
  };

  const mockRolesGuard = (role: UserRole) => ({
    canActivate: jest.fn((context) => {
      const request = context.switchToHttp().getRequest();
      request.user = { role };
      return role === UserRole.CUSTOMER;
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: jest.fn(() => true) })
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard(UserRole.CUSTOMER))
    .compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Role-based access control', () => {
    it('should allow CUSTOMER roles to buy a ticket', async () => {
      const sessionId = 1;
      const user = { id: 1, username: 'john_doe', role: UserRole.CUSTOMER };

      const result = await controller.buyTicket(sessionId, { user });
      
      expect(service.buyTicket).toHaveBeenCalledWith(user, sessionId);
      expect(result).toEqual({
        id: expect.any(Number),
        user,
        sessionId,
        purchaseDate: expect.any(String),
      });
    });

    it('should deny non-CUSTOMER roles from buying a ticket', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [TicketController],
        providers: [
          {
            provide: TicketService,
            useValue: mockTicketService,
          },
        ],
      })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard(UserRole.MANAGER))
      .compile();

      const nonCustomerController = module.get<TicketController>(TicketController);
      const sessionId = 1;
      const user = { id: 1, username: 'john_doe', role: UserRole.MANAGER };

      try {
        await nonCustomerController.buyTicket(sessionId, { user });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
