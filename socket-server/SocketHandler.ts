// socketIoHandler.js
import { Server } from 'socket.io';
import type http from 'http';
const { SWUNO_ROOM } = await import('../src/lib/GameData/GameController');

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);
	const socket_room: string[] = [];
	io.sockets.on('connection', (socket) => {
		socket.on('subscribe', function (room: string) {
			console.log('connected');
			socket.join(room);
			socket_room.push(room);
			io.in(room).emit('reload', `is reloading for: ${room}, subscribe`);
		});

		socket.on('unsubscribe', function (room: string) {
			console.log('disconnected');

			socket.leave(room);
			io.in(room).emit('reload', `is reloading for: ${room}, unsubscribe`);
		});

		socket.on('update', (room: string) => {
			io.in(room).emit('reload', `is reloading for: ${room}, update`);
		});

		socket.on('timer', ({ room_code, time_last }: { room_code: string; time_last: number }) => {
			io.in(room_code).emit('player_countdown', time_last);
		});

		socket.on('test', (msg) => {
			console.log('room_code', msg);
			console.log(SWUNO_ROOM);
			io.emit('success');
		});
	});

	// const Timer = () => {
	// 	const date = new Date();
	// 	for (const room in socket_room) {
	// 		const game = GetRoom(room);
	// 		if (game?.started) {
	// 			const diff = date.getTime() - game.time_last_moved.getTime();
	// 			io.in(room).emit('timer', diff);
	// 		}
	// 	}
	// };
	// setInterval(Timer, 1000);

	console.log('SocketIO injected');
}
