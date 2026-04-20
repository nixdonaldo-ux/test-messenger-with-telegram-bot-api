import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [MessagesModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
