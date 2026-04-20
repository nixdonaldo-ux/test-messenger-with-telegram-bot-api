import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TelegramModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
