import { Manager, Socket } from 'socket.io-client';


export const connectToServer = () => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js');

    const socket = manager.socket('/');

    addListener(socket);

}

//eventos que voy a estar escuchando y emitiendo
const addListener = (socket: Socket) => {
    const serverStatusLabel = document.querySelector('#server-status')!;

    //on = escuchar informacion del servidor
    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected';
        console.log('Disconnected to WebSocket server');
    });
}