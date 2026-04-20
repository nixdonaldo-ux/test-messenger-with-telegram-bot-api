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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const telegram_service_1 = require("./telegram/telegram.service");
const messages_service_1 = require("./messages/messages.service");
const send_message_dto_1 = require("./messages/dto/send-message.dto");
let AppController = class AppController {
    constructor(appService, telegramService, messagesService) {
        this.appService = appService;
        this.telegramService = telegramService;
        this.messagesService = messagesService;
    }
    getStatus() {
        return this.appService.getStatus();
    }
    getHistory(chatId) {
        return {
            success: true,
            data: this.messagesService.getHistory(chatId),
        };
    }
    getChats() {
        return {
            success: true,
            data: this.messagesService.getChats(),
        };
    }
    async sendMessage(sendMessageDto) {
        const result = await this.telegramService.sendMessage(sendMessageDto.chatId, sendMessageDto.text);
        return {
            success: true,
            data: result,
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('messages/history'),
    __param(0, (0, common_1.Query)('chatId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('messages/chats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getChats", null);
__decorate([
    (0, common_1.Post)('messages/send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "sendMessage", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        telegram_service_1.TelegramService,
        messages_service_1.MessagesService])
], AppController);
//# sourceMappingURL=app.controller.js.map