import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module';

const envFilePath = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), '.env.local'),
  resolve(process.cwd(), '..', '..', '.env'),
  resolve(process.cwd(), '..', '..', '.env.local'),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    SharedModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
