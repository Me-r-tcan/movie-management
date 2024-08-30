import { Controller, Post, Get, Param, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decarator';
import { UserRole } from '../user/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @Post(':sessionId/watch')
  @ApiOperation({ summary: 'Mark a session as watched by the current user' })
  @ApiResponse({ status: 200, description: 'Session successfully marked as watched.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async watchSession(@Param('sessionId') sessionId: number, @Request() req) {
    const userId = req.user.userId;
    await this.sessionService.watchSession(userId, sessionId);
    return { message: 'Session successfully marked as watched.' };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('history')
  @ApiOperation({ summary: 'Retrieve watch history for the current user' })
  @ApiResponse({ status: 200, description: 'List of watched sessions.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async getUserWatchHistory(@Request() req) {
    const userId = req.user.userId;
    const watchHistory = await this.sessionService.getUserWatchHistory(userId);
    return watchHistory;
  }
}
