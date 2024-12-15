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
import { SupportChatService } from '../../entities/supportChat/supportChat.service';
import { MessageQueryService } from '../../entities/messages/messageQuery.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class SupportChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;


    getServerInstance(): Server {
        if (this.server) {
            console.log('WebSocket server initialized successfully:', this.server);
        } else {
            console.log('WebSocket server not initialized yet');
        }
        return this.server;
    }

    constructor(
        private readonly supportChatService: SupportChatService,
        private readonly messageQueryService: MessageQueryService,
    ) {}

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('joinSupportChat')
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
        const messages = await this.messageQueryService.findMessagesBySupportChat(chatId);
        if (messages.length > 0) {
            client.emit('supportChatHistory', messages);
        } else {
            client.emit('supportChatHistory', []);
        }
    }
}