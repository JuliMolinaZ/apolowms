// src/chat/chat.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ChatGateway, ChatMessage } from './chat.gateway';

@Controller('api/messages')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Get()
  getMessagesByUser(@Query('username') username: string): ChatMessage[] {
    return this.chatGateway.getMessagesForUser(username);
  }
}
