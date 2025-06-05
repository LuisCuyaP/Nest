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
    //aqui puedo hacer lo que quiera con el mensaje, guardarlo en la base de datos, etc.
    //en este caso solo lo voy a emitir a todos los clientes conectados
    //this.wss.emit('message-from-server', payload);
  }

}
