import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CsrfGuard } from '../auth/guards/csrf.guard';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { CreateAiMatchDto } from './dto/create-ai-match.dto';
import { ResolveInviteDto } from './dto/resolve-invite.dto';
import { LobbyService } from './lobby.service';

@Controller()
@UseGuards(AuthGuard)
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Get('lobby')
  getLobby(@CurrentUser() user: AuthenticatedUser) {
    return this.lobbyService.getLobby(user);
  }

  @Get('friends')
  getFriends() {
    return this.lobbyService.getFriends();
  }

  @Get('invites')
  getInvites(@CurrentUser() user: AuthenticatedUser) {
    return this.lobbyService.getInvites(user);
  }

  @Post('invite')
  @UseGuards(CsrfGuard)
  createInvite(@CurrentUser() user: AuthenticatedUser) {
    return this.lobbyService.createInvite(user);
  }

  @Post('invite/:id/accept')
  @UseGuards(CsrfGuard)
  acceptInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) inviteId: string,
    @Body() body: ResolveInviteDto,
  ) {
    return this.lobbyService.acceptInvite(user, inviteId, body.token);
  }

  @Post('invite/:id/reject')
  @UseGuards(CsrfGuard)
  rejectInvite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', new ParseUUIDPipe({ version: '4' })) inviteId: string,
    @Body() body: ResolveInviteDto,
  ) {
    return this.lobbyService.rejectInvite(user, inviteId, body.token);
  }

  @Post('matchmaking/ai')
  @UseGuards(CsrfGuard)
  createAiMatch(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateAiMatchDto,
  ) {
    return this.lobbyService.createAiMatch(user, body.difficulty);
  }
}
