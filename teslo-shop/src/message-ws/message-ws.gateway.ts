import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MessageWsService } from "./message-ws.service";
import { NewMessageDto } from "./dtos/new-message.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/auth/interfaces";

@WebSocketGateway({cors: true})
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) {}

  async handleConnection(client: Socket) {
    //client => viene del front exactamente desde connectToServer en socket client.ts
    //console.log('Client connected:', client);


    //viene del connectToServer en el front
    const token = client.handshake.headers.authentication as string;
    //const hola = client.handshake.headers.hola as string;
    //console.log('extraHeaders', token, hola);


    //validar token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerClient(client, payload.id);
      //console.log('Payload:', payload);
    } catch (error) {
      console.error('Invalid token:', error);
      client.disconnect(); // Desconectar al cliente si el token es inválido
      return;
    }
    console.log({payload});

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
/*     client.broadcast.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'No message provided'
    });
 */
    //emite a todos los clientes conectados en el front
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'No message provided'
    });
  }

}
