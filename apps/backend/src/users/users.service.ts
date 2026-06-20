import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.usersRepository.findByPhone(phone);
  }

  createUser(data: {
    phone: string;
    firstName: string;
    lastName: string;
    passwordHash: string;
  }): Promise<User> {
    return this.usersRepository.create(data);
  }

  updateRefreshToken(
    userId: string,
    refreshTokenHash: string | null,
  ): Promise<User> {
    return this.usersRepository.updateRefreshToken(userId, refreshTokenHash);
  }

  clearRefreshToken(userId: string): Promise<User> {
    return this.usersRepository.clearRefreshToken(userId);
  }

  toAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
