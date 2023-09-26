import { RoomController } from '$lib/db/controller/RoomController';

export const actions = {
	connect: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const player_id = String(data.get('player_id'));
		const room_code = String(data.get('room_code'));
		return await RoomController.joinRoom({ name, player_id, room_code });
	},
	host: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name'));
		const player_id = String(data.get('player_id'));
		const room_code = await RoomController.initialRoom({ name, player_id });
		return { room_code: room_code };
	}
};
