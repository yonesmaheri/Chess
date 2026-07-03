import {
  BadRequestException,
  ConflictException,
  GoneException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Chess } from 'chess.js';
import { randomBytes, randomUUID } from 'node:crypto';
import {
  LobbyInvite,
  LobbyInviteStatus,
  User,
} from '../generated/prisma/client';
import { PrismaService } from '../shared/prisma.service';
import type { AuthenticatedUser } from '../auth/types/authenticated-user.type';

const INVITE_TTL_HOURS = 6;
const INVITE_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const INVITE_RATE_LIMIT_MAX_REQUESTS = 5;

type InviteWithRelations = LobbyInvite & {
  creator: User;
  acceptedBy: User | null;
};

@Injectable()
export class LobbyService {
  constructor(private readonly prisma: PrismaService) {}

  async getLobby(user: AuthenticatedUser) {
    const [inviteData, friendsData] = await Promise.all([
      this.getInvites(user),
      this.getFriends(),
    ]);

    return {
      hero: {
        title: 'اتاق بازی',
        subtitle: 'روش مورد نظر خود را برای شروع بازی انتخاب کنید.',
      },
      online: {
        title: 'بازی آنلاین سریع',
        description: 'یک حریف تصادفی پیدا کنید و وارد صف بازی آنلاین شوید.',
      },
      ai: {
        title: 'بازی با هوش مصنوعی',
        description:
          'سطح هوش مصنوعی را انتخاب کنید و بازی تمرینی را شروع کنید.',
        levels: Array.from({ length: 10 }, (_value, index) => index + 1),
        recommendedDifficulty: 7,
      },
      friends: {
        title: 'بازی سفارشی و دوستان',
        description:
          'لینک دعوت اختصاصی بسازید و آن را با دوستانتان به اشتراک بگذارید.',
        ...inviteData,
        ...friendsData,
      },
      trustIndicators: [
        'بازی خصوصی',
        'فیرپلی',
        'پشتیبانی از موتور شطرنج',
        'زیرساخت امن',
        'طراحی واکنش‌گرا',
      ],
      currentUser: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
      },
    };
  }

  async getFriends() {
    return {
      supported: false,
      onlineFriends: [],
      emptyStateMessage: 'سیستم دوستی هنوز در این نسخه از محصول فعال نشده است.',
    };
  }

  async getInvites(user: AuthenticatedUser) {
    await this.expireStaleInvites();

    const now = new Date();
    const [activeInvite, recentChallenges, incomingInvitations] =
      await Promise.all([
        this.prisma.lobbyInvite.findFirst({
          where: {
            creatorId: user.id,
            status: LobbyInviteStatus.pending,
            expiresAt: { gt: now },
          },
          include: {
            creator: true,
            acceptedBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.lobbyInvite.findMany({
          where: {
            creatorId: user.id,
          },
          include: {
            creator: true,
            acceptedBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        }),
        this.prisma.lobbyInvite.findMany({
          where: {
            recipientUserId: user.id,
            status: LobbyInviteStatus.pending,
            expiresAt: { gt: now },
          },
          include: {
            creator: true,
            acceptedBy: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        }),
      ]);

    return {
      activeInvite: activeInvite ? this.mapInvite(activeInvite) : null,
      recentChallenges: recentChallenges.map((invite) =>
        this.mapInvite(invite),
      ),
      incomingInvitations: incomingInvitations.map((invite) =>
        this.mapInvite(invite),
      ),
    };
  }

  async createInvite(user: AuthenticatedUser) {
    await this.expireStaleInvites();

    const now = new Date();
    const windowStart = new Date(now.getTime() - INVITE_RATE_LIMIT_WINDOW_MS);
    const recentInvitesCount = await this.prisma.lobbyInvite.count({
      where: {
        creatorId: user.id,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    if (recentInvitesCount >= INVITE_RATE_LIMIT_MAX_REQUESTS) {
      throw new HttpException(
        'تعداد درخواست‌های ساخت دعوت بیش از حد مجاز است.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const existingInvite = await this.prisma.lobbyInvite.findFirst({
      where: {
        creatorId: user.id,
        status: LobbyInviteStatus.pending,
        expiresAt: {
          gt: now,
        },
      },
      include: {
        creator: true,
        acceptedBy: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (existingInvite) {
      return {
        invite: this.mapInvite(existingInvite),
        reused: true,
      };
    }

    const invite = await this.prisma.lobbyInvite.create({
      data: {
        creatorId: user.id,
        token: randomBytes(16).toString('hex'),
        expiresAt: new Date(now.getTime() + INVITE_TTL_HOURS * 60 * 60 * 1000),
      },
      include: {
        creator: true,
        acceptedBy: true,
      },
    });

    return {
      invite: this.mapInvite(invite),
      reused: false,
    };
  }

  async acceptInvite(user: AuthenticatedUser, inviteId: string, token: string) {
    await this.expireStaleInvites();

    const invite = await this.getInviteOrThrow(inviteId);
    this.assertInviteCanBeResolved(invite, token, user.id);

    const updatedInvite = await this.prisma.lobbyInvite.update({
      where: { id: inviteId },
      data: {
        status: LobbyInviteStatus.accepted,
        acceptedById: user.id,
      },
      include: {
        creator: true,
        acceptedBy: true,
      },
    });
    const chess = new Chess();

    return {
      invite: this.mapInvite(updatedInvite),
      game: {
        sessionId: randomUUID(),
        type: 'private',
        status: 'ready',
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn(),
        opponent: {
          name: `${updatedInvite.creator.firstName} ${updatedInvite.creator.lastName}`,
        },
      },
    };
  }

  async rejectInvite(user: AuthenticatedUser, inviteId: string, token: string) {
    await this.expireStaleInvites();

    const invite = await this.getInviteOrThrow(inviteId);
    this.assertInviteCanBeResolved(invite, token, user.id);

    const updatedInvite = await this.prisma.lobbyInvite.update({
      where: { id: inviteId },
      data: {
        status: LobbyInviteStatus.rejected,
      },
      include: {
        creator: true,
        acceptedBy: true,
      },
    });

    return {
      invite: this.mapInvite(updatedInvite),
    };
  }

  async createAiMatch(user: AuthenticatedUser, difficulty: number) {
    const chess = new Chess();

    return {
      status: 'ready',
      sessionId: randomUUID(),
      type: 'ai',
      difficulty,
      difficultyLabel: this.getDifficultyLabel(difficulty),
      player: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
      },
      opponent: {
        name: 'Chess.ir Engine',
        title: 'تمرین',
      },
      board: {
        fen: chess.fen(),
        pgn: chess.pgn(),
        turn: chess.turn(),
      },
      note: 'منطق موتور در این مرحله پیاده‌سازی نشده و فقط آماده‌سازی بازی انجام شده است.',
    };
  }

  private async getInviteOrThrow(inviteId: string) {
    const invite = await this.prisma.lobbyInvite.findUnique({
      where: { id: inviteId },
      include: {
        creator: true,
        acceptedBy: true,
      },
    });

    if (!invite) {
      throw new NotFoundException('دعوت موردنظر پیدا نشد.');
    }

    return invite;
  }

  private assertInviteCanBeResolved(
    invite: InviteWithRelations,
    token: string,
    userId: string,
  ) {
    if (invite.token !== token) {
      throw new NotFoundException('دعوت موردنظر پیدا نشد.');
    }

    if (invite.creatorId === userId) {
      throw new BadRequestException('امکان پاسخ به دعوت خودتان وجود ندارد.');
    }

    if (invite.expiresAt.getTime() <= Date.now()) {
      throw new GoneException('این دعوت منقضی شده است.');
    }

    if (invite.status !== LobbyInviteStatus.pending) {
      throw new ConflictException('این دعوت دیگر فعال نیست.');
    }

    if (invite.acceptedById && invite.acceptedById !== userId) {
      throw new ConflictException(
        'این دعوت قبلاً توسط کاربر دیگری پذیرفته شده است.',
      );
    }
  }

  private mapInvite(invite: InviteWithRelations) {
    const frontendBaseUrl =
      process.env.FRONTEND_APP_URL ?? 'http://localhost:3000';

    return {
      id: invite.id,
      status: invite.status,
      difficulty: invite.difficulty,
      createdAt: invite.createdAt.toISOString(),
      expiresAt: invite.expiresAt.toISOString(),
      token: invite.token,
      inviteUrl: `${frontendBaseUrl}/lobby?invite=${invite.id}&token=${invite.token}`,
      creator: {
        id: invite.creator.id,
        fullName: `${invite.creator.firstName} ${invite.creator.lastName}`,
      },
      acceptedBy: invite.acceptedBy
        ? {
            id: invite.acceptedBy.id,
            fullName: `${invite.acceptedBy.firstName} ${invite.acceptedBy.lastName}`,
          }
        : null,
    };
  }

  private getDifficultyLabel(difficulty: number) {
    if (difficulty <= 3) {
      return 'آسان';
    }

    if (difficulty <= 6) {
      return 'متوسط';
    }

    if (difficulty <= 8) {
      return 'سخت';
    }

    return 'حرفه‌ای';
  }

  private async expireStaleInvites() {
    await this.prisma.lobbyInvite.updateMany({
      where: {
        status: LobbyInviteStatus.pending,
        expiresAt: {
          lte: new Date(),
        },
      },
      data: {
        status: LobbyInviteStatus.expired,
      },
    });
  }
}
