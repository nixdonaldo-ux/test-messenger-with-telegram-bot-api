import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'telegram-messenger-server',
      status: 'ok',
    };
  }
}
