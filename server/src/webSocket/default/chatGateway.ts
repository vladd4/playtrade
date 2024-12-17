import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketChatService } from './webSocketChat.service';
import { CreateMessageDto } from '../../entities/messages/createMessageDTO';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly webSocketChatService: WebSocketChatService) {}

  handleConnection(client: Socket) {
    console.log(
      `Client connected: ${client.id} at ${new Date().toISOString()}`,
    );
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    console.log(`Received sendMessage event from client: ${client.id}`);
    try {
      const { chat, message } =
        await this.webSocketChatService.handleChatCreation(createMessageDto);

      if (message) {
        this.server.to(chat.id).emit('message', {
          id: message.id,
          chatId: chat.id,
          content: message.content,
          timestamp: message.timestamp,
          seenByUser: false,
          sender: {
            id: message.sender.id,
            avatar: message.sender.avatarPhoto,
            username: message.sender.name,
          },
          receiver: {
            id: message.receiver.id,
            avatar: message.receiver.avatarPhoto,
            username: message.receiver.name,
          },
        });
      }
    } catch (error) {
      client.emit('error', error.message);
    }
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const { chatId } = data;

    if (!chatId) {
      client.emit('error', 'No chatId provided');
      return;
    }

    client.join(chatId);

    const messages = await this.webSocketChatService.findMessagesByChat(chatId);
    client.emit('chatHistory', messages);
  }

  @SubscribeMessage('leaveChat')
  async handleLeaveChat(
    @ConnectedSocket() client: Socket,
    @MessageBody('chatId') chatId: string,
  ) {
    client.leave(chatId);
  }
}
