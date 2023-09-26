// socketIoHandler.js
import { Server } from 'socket.io';
import type http from 'http';

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		const username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		socket.on('message', (message) => {
			io.emit('message', {
				from: username,
				message: message,
				time: new Date().toLocaleString()
			});
		});
	});

	console.log('SocketIO injected');
}
