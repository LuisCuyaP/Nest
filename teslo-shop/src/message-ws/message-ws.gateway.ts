import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageWsService } from "./message-ws.service";

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

}
