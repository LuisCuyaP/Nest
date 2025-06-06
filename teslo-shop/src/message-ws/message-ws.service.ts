import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessageWsService {

    private connectedClients: ConnectedClients = {}

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    getConnectedClients(): string[] {
        console.log(this.connectedClients);
        return Object.keys( this.connectedClients );
    }

    async registerClient( client: Socket, userId: string ) {

        const user = await this.userRepository.findOneBy({ id: userId });
        if ( !user ) throw new Error('User not found');
        if ( !user.isActive ) throw new Error('User not active');

        this.checkUserConnection( user );

        this.connectedClients[client.id] = {
            socket: client,
            user: user,
        };
    }

    removeClient( clientId: string ) {
        delete this.connectedClients[clientId];
    }

    getUserFullName( socketId: string ) {
        return this.connectedClients[socketId].user.fullName;
    }

    //solo permitir un usuario conectado
    private checkUserConnection( user: User ) {

        for (const clientId of Object.keys( this.connectedClients ) ) {
            
            const connectedClient = this.connectedClients[clientId];

            if ( connectedClient.user.id === user.id ){
                connectedClient.socket.disconnect();
                break;
            }
        }

    }

}
