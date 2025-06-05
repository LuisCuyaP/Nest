import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageWsService } from "./message-ws.service";
import { NewMessageDto } from "./dtos/new-message.dto";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  handleConnection(client: Socket) {
    //console.log('Client connected:', client.id);
    this.messageWsService.registerClient(client);
    //console.log({conectados: this.messageWsService.getConnectedClients()});
  
    //nuevos clientes
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }
  
  handleDisconnect(client: Socket) {
    //console.log('Client disconnected:', client.id);
    this.messageWsService.removeClient(client.id);
    this.wss.emit('clients-updated', this.messageWsService.getConnectedClients());
  }

  //escuchar el evento del cliente, este evento viene del cliente de messageForm.addEventListener('submit'....
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log('Message from client:', client.id, payload);
  }

  @SubscribeMessage('message-from-client2')
  handleMessageFromClient2(client: Socket, payload: NewMessageDto) {
    console.log('Message from client:', client.id, payload);

    // Emitir un mensaje a solo un cliente conectado
/*     client.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'No message provided'
    }); */

    //emite el mensahe a todos menos al cliente que lo envio
    client.broadcast.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'No message provided'
    });
  }

}
