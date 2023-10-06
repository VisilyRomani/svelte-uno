import { Game } from './game';
import { Player } from './player';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

const SWUNO_ROOM = new Map<string, Game>();

export const Controller = {
	CreateRoom: (player: { player_id: string; name: string }) => {
		const room_code = uid.rnd(5);
		const host = new Player(player, true);
		const game = new Game(host);
		SWUNO_ROOM.set(room_code, game);
		return room_code;
	},
	GetRoom: (room_code: string) => {
		return SWUNO_ROOM.get(room_code);
	},
	ForceDisconnectPlayer: (player_id: string) => {
		// future: make this more efficient
		SWUNO_ROOM.forEach((game, room_code) => {
			game.playerDisconnect(player_id);
			if (!game.playerCount()) {
				SWUNO_ROOM.delete(room_code);
			}
		});
	},
	DeleteRoom: (room_code: string) => {
		SWUNO_ROOM.delete(room_code);
	},
	GetAllRooms: () => {
		return SWUNO_ROOM;
	}
};
