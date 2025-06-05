import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { MessageWsService } from "./message-ws.service";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    private readonly messageWsService: MessageWsService
  ) {}

  handleConnection(client: Socket) {
    //console.log('Client connected:', client.id);
    this.messageWsService.registerClient(client);
    console.log({conectados: this.messageWsService.getConnectedClients()});
  }
  
  handleDisconnect(client: Socket) {
    //console.log('Client disconnected:', client.id);
    this.messageWsService.removeClient(client.id);
  }

}
