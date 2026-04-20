"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
let MessagesService = class MessagesService {
    constructor() {
        this.history = [];
    }
    addMessage(entry) {
        this.history.unshift(entry);
    }
    getHistory(chatId) {
        if (!chatId) {
            return [...this.history];
        }
        return this.history.filter((message) => message.chatId === chatId);
    }
    getChats() {
        const summaryMap = new Map();
        this.history.forEach((message) => {
            const existing = summaryMap.get(message.chatId);
            if (!existing) {
                summaryMap.set(message.chatId, {
                    chatId: message.chatId,
                    lastText: message.text,
                    lastTimestamp: message.timestamp,
                    direction: message.direction,
                    totalMessages: 1,
                });
            }
            else {
                existing.totalMessages += 1;
            }
        });
        return Array.from(summaryMap.values()).sort((a, b) => b.lastTimestamp.localeCompare(a.lastTimestamp));
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
//# sourceMappingURL=messages.service.js.map