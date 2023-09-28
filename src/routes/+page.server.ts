import { CreateRoom, GetRoom } from '$lib/GameData/GameController';
import { error } from '@sveltejs/kit';

export const actions = {
	connect: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const player_id = String(data.get('player_id'));
		const room_code = String(data.get('room_code'));
		const room = GetRoom(room_code);
		if (room) {
			room.playerJoin({ player_id: player_id, name: name });
			return { room_code: room_code };
		} else {
			throw error(400, { message: 'cant find room' });
		}
	},
	host: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const player_id = String(data.get('player_id'));
		const room_code = CreateRoom({ player_id, name });
		return { room_code: room_code };
	}
};
