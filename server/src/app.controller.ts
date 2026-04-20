import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { TelegramService } from './telegram/telegram.service';
import { MessagesService } from './messages/messages.service';
import { SendMessageDto } from './messages/dto/send-message.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telegramService: TelegramService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  getStatus() {
    return this.appService.getStatus();
  }

  @Get('messages/history')
  getHistory(@Query('chatId') chatId?: string) {
    return {
      success: true,
      data: this.messagesService.getHistory(chatId),
    };
  }

  @Get('messages/chats')
  getChats() {
    return {
      success: true,
      data: this.messagesService.getChats(),
    };
  }

  @Post('messages/send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const result = await this.telegramService.sendMessage(
      sendMessageDto.chatId,
      sendMessageDto.text,
    );

    return {
      success: true,
      data: result,
    };
  }
}
