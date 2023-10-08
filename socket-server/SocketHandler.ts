import { Server } from 'socket.io';
import type http from 'http';
const { Controller } = await import('./GameData/GameController');

type NewRoomType = {
	player: {
		name: string;
		player_id: string;
	};
};

export default function injectSocketIO(server: http.Server) {
	const io = new Server(server);
	const PlayerSocket: { player_id: string; socket_id: string; room_code: string }[] = [];
	io.sockets.on('connection', (socket) => {
		socket.on('NEW-ROOM', ({ player }: NewRoomType, callback) => {
			const room_code = Controller.CreateRoom(player);
			PlayerSocket.push({
				player_id: player.player_id,
				socket_id: socket.id,
				room_code: room_code
			});
			callback({ room_code });
		});

		socket.on(
			'JOIN-ROOM',
			(
				{ room_code, player }: { room_code: string; player: { name: string; player_id: string } },
				callback
			) => {
				const room = Controller.GetRoom(room_code);
				if (room) {
					room.playerJoin(player);
					io.in(room_code).emit('FORCE-DATA-UPDATE');
					callback({ room_code: room_code });
					PlayerSocket.push({
						player_id: player.player_id,
						socket_id: socket.id,
						room_code: room_code
					});
				}
			}
		);

		socket.on('GET-ROOM-DATA', (msg: { room_code: string; player_id: string }, callback) => {
			const room = Controller.GetRoom(msg.room_code)?.gameState(msg.player_id);
			callback({ room });
		});

		socket.on('START-GAME', (room_code: string) => {
			const room = Controller.GetRoom(room_code);
			if (room) {
				room.startGame();
				io.in(room_code).emit('FORCE-DATA-UPDATE');
			}
		});

		socket.on(
			'PLAY-CARD',
			(
				card: { card_id: string; suit: string; value: string },
				room_code: string,
				player: { player_id: string }
			) => {
				const room = Controller.GetRoom(room_code);
				if (room) {
					room.playCard({ ...card, player_id: player.player_id, selected_suit: '' });
				}
			}
		);

		socket.on('UPDATE', (room: string) => {
			io.in(room).emit('FORCE-DATA-UPDATE');
		});

		socket.on('subscribe', function (room: string) {
			socket.join(room);
			io.in(room).emit('reload', `is reloading for: ${room}, subscribe`);
		});

		socket.on('unsubscribe', function (room_code: string, player_id: string) {
			const room = Controller.GetRoom(room_code);
			room?.playerDisconnect(player_id);
			if (!room?.playerCount()) {
				Controller.DeleteRoom(room_code);
				socket.leave(room_code);
			}
			io.in(room_code).emit('FORCE-DATA-UPDATE');
		});
		socket.on('disconnect', () => {
			const player = PlayerSocket.find((ps) => ps.socket_id === ps.socket_id);
			if (player) {
				Controller.ForceDisconnectPlayer(player.player_id);
				io.in(player.room_code).emit('FORCE-DATA-UPDATE');
			}
		});
	});

	const StartLoop = () => {
		const player_timer = 30;
		const date = new Date();
		Controller.GetAllRooms().forEach((game, room) => {
			if (game.started) {
				const time_difference = (date.getTime() - game.time_last_moved.getTime()) / 1000;
				console.log(time_difference);
				if (player_timer - time_difference < 0) {
					game.drawCard(true);
					io.in(room).emit('FORCE-DATA-UPDATE');
				} else {
					io.in(room).emit('TIMER', player_timer - time_difference);
				}
			}
		});
	};
	setInterval(StartLoop, 500);

	console.log('SocketIO injected');
}
