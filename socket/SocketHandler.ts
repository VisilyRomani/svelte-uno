// socketIoHandler.js
import { Server } from 'socket.io';
import type http from 'http';

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);

	io.sockets.on('connection', (socket) => {
		const username = `User ${Math.round(Math.random() * 999999)}`;
		socket.emit('name', username);

		socket.on('subscribe', function (room: string) {
			socket.join(room);
			io.in(room).emit('reload', `is reloading for: ${room}`);
		});

		socket.on('unsubscribe', function (room: string) {
			console.log('disconnected');
			socket.leave(room);
			io.in(room).emit('reload', `is reloading for: ${room}`);
		});
	});

	console.log('SocketIO injected');
}
