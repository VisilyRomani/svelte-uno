// socketIoHandler.js
import { Server } from 'socket.io';
import type http from 'http';

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);

	io.sockets.on('connection', (socket) => {
		socket.on('subscribe', function (room: string) {
			socket.join(room);
			io.in(room).emit('reload', `is reloading for: ${room}, subscribe`);
		});

		socket.on('unsubscribe', function (room: string) {
			console.log('disconnected');
			socket.leave(room);
			io.in(room).emit('reload', `is reloading for: ${room}, unsubscribe`);
		});

		socket.on('update', (room: string) => {
			io.in(room).emit('reload', `is reloading for: ${room}, update`);
			console.log('start reload', room);
		});

		// io.on('reload', () => {
		// 	console.log('start reload');
		// });
	});

	console.log('SocketIO injected');
}
