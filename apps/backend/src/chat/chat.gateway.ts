// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../modules/users/users.service';

export interface ChatMessage {
  room: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp?: number;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getMessagesForUser(username: string): ChatMessage[] {
    throw new Error('Method not implemented.');
  }
  @WebSocketServer() server: Server;

  private messages: ChatMessage[] = [];

  constructor(private readonly usersService: UsersService) {}

  async handleConnection(client: Socket) {
    const { username } = client.handshake.query as { username?: string };
    console.log(`Cliente conectado: ${client.id}`);
    if (username) {
      console.log(`Usuario conectado: ${username}`);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.usersService.setOnlineStatus(username, true);
        this.server.emit('userOnline', username);
      } catch (error) {
        console.error(`Error al actualizar online para ${username}:`, error);
      }
    } else {
      console.warn(`No se proporcionó username para el cliente ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    const { username } = client.handshake.query as { username?: string };
    console.log(`Cliente desconectado: ${client.id}`);
    if (username) {
      console.log(`Usuario desconectado: ${username}`);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        await this.usersService.setOnlineStatus(username, false);
        this.server.emit('userOffline', username);
      } catch (error) {
        console.error(`Error al actualizar offline para ${username}:`, error);
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @MessageBody() data: { room: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(data.room);
    const roomMessages = this.messages.filter((m) => m.room === data.room);
    client.emit('roomHistory', roomMessages);
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    @MessageBody()
    data: {
      room: string;
      sender: string;
      recipient: string;
      text: string;
    },
  ) {
    const newMsg: ChatMessage = { ...data, timestamp: Date.now() };
    this.messages.push(newMsg);
    this.server.to(data.room).emit('newMessage', newMsg);
  }
}
