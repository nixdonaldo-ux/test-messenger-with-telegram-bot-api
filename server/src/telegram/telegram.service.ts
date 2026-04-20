import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';
import { MessagesService } from '../messages/messages.service';
import { MessageRecord } from '../messages/messages.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) {
    const token = this.configService.get<string>('BOT_TOKEN');
    if (!token) {
      throw new InternalServerErrorException('BOT_TOKEN is required in environment variables.');
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.bot.on('message', this.handleIncomingMessage.bind(this));

    this.logger.log('Telegram bot polling started.');
  }

  private handleIncomingMessage(message: TelegramBot.Message) {
    if (!message.text) {
      return;
    }

    const chatId = message.chat.id.toString();
    const timestamp = new Date((message.date || Math.floor(Date.now() / 1000)) * 1000).toISOString();
    const record: MessageRecord = {
      chatId,
      text: message.text,
      timestamp,
      direction: 'incoming',
      username: message.from?.username,
      fromId: message.from?.id?.toString(),
      telegramMessageId: message.message_id,
    };

    this.messagesService.addMessage(record);
    this.logger.log(`Received incoming message from chat ${chatId}`);
  }

  async sendMessage(chatId: string, text: string) {
    try {
      const result = await this.bot.sendMessage(chatId, text);
      const record: MessageRecord = {
        chatId,
        text,
        timestamp: new Date().toISOString(),
        direction: 'outgoing',
        telegramMessageId: result.message_id,
      };
      this.messagesService.addMessage(record);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to send Telegram message: ' + String(error),
      );
    }
  }
}
