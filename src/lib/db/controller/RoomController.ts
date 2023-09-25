import { error } from '@sveltejs/kit';
import { Room } from '../model/Room';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

export const RoomController = {
	initialRoom: async (player: { name: string; id: string }) => {
		const room = await Room.create({
			code: uid.rnd(4),
			players: [{ name: player.name, id: player.id }]
		});
		return room;
	},
	getRoomData: async (room_code: string) => {
		const room = await Room.findOne({ code: room_code }).exec();
		console.log('room', room);
		if (room) {
			return {
				// started: room.game?.started,
				// hostid: room.host_id,
				// players: room.players.map((p) => ({ name: p.name, _id: p._id })),
				// code: room.room_code
			};
		} else {
			throw error(404, { message: "Can't find room data" });
		}
	},
	joinRoom: async ({ room_code, name, id }: { room_code: string; name: string; id: string }) => {
		const room = await Room.findOne({ code: room_code }).exec();
		console.log(room);

		if (!room?.game) {
			throw error(404, { message: 'not found' });
		}
		if (!room.game.started) {
			throw error(405, { message: 'game is started' });
		}
		if (room.players.find((i) => i._id === id)) {
			return { room_code: room.room_code };
		} else {
			room.players.push({ name: name, id: id, hand: [] });
			room.save();
			return { room_code: room.room_code };
		}
	}
};
