import { initialRoom, joinRoom } from '$lib/db/controller/RoomController';

export const actions = {
	connect: async ({ request }) => {
		const data = await request.formData();
		const room = Object.fromEntries(data) as { name: string; id: string; room_code: string };
		return await joinRoom(room);
	},
	host: async ({ request }) => {
		const data = await request.formData();
		const room = Object.fromEntries(data) as {
			name: string;
			id: string;
		};
		const db_data = await initialRoom(room);
		return { room_code: db_data.code };
	}
};
