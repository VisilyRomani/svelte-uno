import { Server } from 'socket.io';
import type http from 'http';
const controller = await import('./GameData/GameController');

type NewRoomType = {
	room_code: string;
	player: {
		name: string;
		player_id: string;
	};
};

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);

	io.sockets.on('connection', (socket) => {
		socket.on('NEW-ROOM', (msg: NewRoomType, callback) => {
			const room_code = controller.CreateRoom(msg.player);
			callback({ room_code });
		});

		socket.on(
			'JOIN-ROOM',
			(msg: { room_code: string; player: { name: string; player_id: string } }, callback) => {
				console.log(msg);
				const room = controller.GetRoom(msg.room_code);
				if (room) {
					room.playerJoin(msg.player);
					callback({ room_code: msg.room_code });
					io.in(msg.room_code).emit('FORCE-DATA-UPDATE');
				}
			}
		);

		socket.on('GET-ROOM-DATA', (msg: { room_code: string; player_id: string }, callback) => {
			const room = controller.GetRoom(msg.room_code)?.gameState(msg.player_id);
			callback({ room });
		});

		socket.on('START-GAME', (room_code: string) => {
			const room = controller.GetRoom(room_code);
			if (room) {
				room.startGame();
				io.in(room_code).emit('FORCE-DATA-UPDATE');
			}
		});

		socket.on('subscribe', function (room: string) {
			socket.join(room);
			io.in(room).emit('reload', `is reloading for: ${room}, subscribe`);
		});

		socket.on('unsubscribe', function (room: string) {
			console.log('disconnected');

			socket.leave(room);
			io.in(room).emit('reload', `is reloading for: ${room}, unsubscribe`);
		});

		socket.on('UPDATE', (room: string) => {
			io.in(room).emit('FORCE-DATA-UPDATE');
		});

		// socket.on('timer', ({ room_code, time_last }: { room_code: string; time_last: number }) => {
		// 	io.in(room_code).emit('player_countdown', time_last);
		// });
	});

	const StartLoop = () => {
		const date = new Date();
		controller.SWUNO_ROOM.forEach((game, room) => {
			if (game.started) {
				io.in(room).emit('TIMER', date.getTime() - game.time_last_moved.getTime());
			}
		});
		// for (const room in controller.SWUNO_ROOM) {
		// 	const game = GetRoom(room);
		// 	if (game?.started) {
		// 		const diff = date.getTime() - game.time_last_moved.getTime();
		// 		io.in(room).emit('timer', diff);
		// 	}
		// }
	};
	// setInterval(Timer, 1000);

	console.log('SocketIO injected');
}
