import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      service: 'chess.ir backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
