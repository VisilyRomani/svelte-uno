import { startGame } from '$lib/db/controller/RoomController.js';

export const load = async ({ params }) => {
	return {
		slug: params.slug
	};
};

export const actions = {
	start: async ({ request }) => {
		const data = await request.formData();
		const room = Object.fromEntries(data) as {
			room_code: string;
		};
		return startGame(room.room_code);
	}
};
