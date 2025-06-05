import { Manager, Socket } from 'socket.io-client';


export const connectToServer = () => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js');

    const socket = manager.socket('/');

    addListener(socket);

}

//eventos que voy a estar escuchando y emitiendo
const addListener = (socket: Socket) => {

    //definir elementos del DOM que viene del html en main.ts
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;


    //on = escuchar informacion del servidor
    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'connected';
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'disconnected';
        console.log('Disconnected to WebSocket server');
    });

    //on => escuchar al servidor
    //total de clientes conectados desde el front, este evento viene desde el back
    //cada vez que un cliente nuevo se conecta, el back desde handleConnection dispara ese evento de this.wss.emit.....
    //y el front lo escuchara cuando dispare ese evento y recibira el getConnectedClients que viene del back
    socket.on('clients-updated', (clients: string[]) => {
       console.log({ clients }); 
       let clientHtml = '';
       clients.forEach( clientId => {
           clientHtml += `<li>${clientId}</li>`;
       });
       clientsUl.innerHTML = clientHtml;
    })

    //escuchar el evento del input en el formulario, apretar enter en la caja de texto
    //este es el evento que quiero enviar al servidor
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const message = messageInput.value.trim();
        if (message.length <= 0) return; // No enviar mensajes vacíos

        socket.emit('message-from-client2', { id: 'YOOO', message });
        console.log({ id: 'YOOO', message: messageInput.value });
        
        // Limpiar el campo de entrada
        messageInput.value = '';
    });


    //on => escuchar al servidor
    socket.on('message-from-server', ( payload: { fullName: string, message: string  }) => {
        const newMessage = `
        <li>
            <strong>${ payload.fullName }</strong>
            <span>${ payload.message }</span>
        </li>
        `
       const li = document.createElement('li');
       li.innerHTML = newMessage;
       messagesUl.append(li);
    });



}