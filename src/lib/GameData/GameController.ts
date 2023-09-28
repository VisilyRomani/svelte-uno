import { Game } from './game';
import { Player } from './player';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

export const SWUNO_ROOM = new Map<string, Game>();

export const CreateRoom = (player: { player_id: string; name: string }) => {
	const room_code = uid.rnd(5);
	const host = new Player(player, true);
	const game = new Game(host);
	SWUNO_ROOM.set(room_code, game);
	return room_code;
};

export const GetRoom = (room_code: string) => {
	return SWUNO_ROOM.get(room_code);
};
