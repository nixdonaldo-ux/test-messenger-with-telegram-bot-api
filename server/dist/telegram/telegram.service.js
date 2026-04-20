"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const messages_service_1 = require("../messages/messages.service");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(configService, messagesService) {
        this.configService = configService;
        this.messagesService = messagesService;
        this.logger = new common_1.Logger(TelegramService_1.name);
        const token = this.configService.get('BOT_TOKEN');
        if (!token) {
            throw new common_1.InternalServerErrorException('BOT_TOKEN is required in environment variables.');
        }
        this.bot = new node_telegram_bot_api_1.default(token, { polling: true });
        this.bot.on('message', this.handleIncomingMessage.bind(this));
        this.logger.log('Telegram bot polling started.');
    }
    handleIncomingMessage(message) {
        if (!message.text) {
            return;
        }
        const chatId = message.chat.id.toString();
        const timestamp = new Date((message.date || Math.floor(Date.now() / 1000)) * 1000).toISOString();
        const record = {
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
    async sendMessage(chatId, text) {
        try {
            const result = await this.bot.sendMessage(chatId, text);
            const record = {
                chatId,
                text,
                timestamp: new Date().toISOString(),
                direction: 'outgoing',
                telegramMessageId: result.message_id,
            };
            this.messagesService.addMessage(record);
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to send Telegram message: ' + String(error));
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        messages_service_1.MessagesService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map