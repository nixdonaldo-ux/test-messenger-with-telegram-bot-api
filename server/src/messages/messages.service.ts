import { Injectable } from '@nestjs/common';

export type MessageDirection = 'incoming' | 'outgoing';

export interface MessageRecord {
  chatId: string;
  text: string;
  timestamp: string;
  direction: MessageDirection;
  username?: string;
  fromId?: string;
  telegramMessageId?: number;
}

export interface ChatSummary {
  chatId: string;
  lastText: string;
  lastTimestamp: string;
  direction: MessageDirection;
  totalMessages: number;
}

@Injectable()
export class MessagesService {
  private readonly history: MessageRecord[] = [];

  addMessage(entry: MessageRecord) {
    this.history.unshift(entry);
  }

  getHistory(chatId?: string) {
    if (!chatId) {
      return [...this.history];
    }

    return this.history.filter((message) => message.chatId === chatId);
  }

  getChats(): ChatSummary[] {
    const summaryMap = new Map<string, ChatSummary>();

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
      } else {
        existing.totalMessages += 1;
      }
    });

    return Array.from(summaryMap.values()).sort((a, b) =>
      b.lastTimestamp.localeCompare(a.lastTimestamp),
    );
  }
}
