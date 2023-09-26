import { error } from '@sveltejs/kit';
import { Room } from '../model/Room';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();
export const RoomController = {
	initialRoom: async (player: { name: string; player_id: string }) => {
		const room = await Room.create({
			room_code: uid.rnd(4),
			players: [{ name: player.name, player_id: player.player_id, is_host: true }],
			game: {}
		});
		return room.room_code;
	},
	getRoomData: async (room_code: string) => {
		const room = await Room.findOne({ room_code: room_code });
		if (!room) {
			throw error(404, { message: "Can't find room data" });
		}

		return {
			started: room.game.started,
			players: room.players.map((p) => ({
				name: p.name,
				player_id: p.player_id,
				is_host: p.is_host
			})),
			room_code: room.room_code
		};
	},
	joinRoom: async ({
		room_code,
		name,
		player_id
	}: {
		room_code: string;
		name: string;
		player_id: string;
	}) => {
		const room = await Room.findOne({ room_code: room_code }).exec();
		if (!room) {
			throw error(405, { message: "Can't find room" });
		}

		if (room.game.started) {
			throw error(405, { message: 'Game is started' });
		}

		if (room.players.find((i) => i.player_id === player_id)) {
			return { room_code: room.room_code };
		} else {
			room.players.push({ name: name, player_id: player_id, hand: [] });
			room.save();
			return { room_code: room.room_code };
		}
	}
};
