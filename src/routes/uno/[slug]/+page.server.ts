import { GetRoom } from '$lib/GameData/GameController.js';
import { error } from '@sveltejs/kit';

export const ssr = false;
export const load = async ({ params }) => {
	return {
		slug: params.slug
	};
};

export const actions = {
	start: async ({ request }) => {
		const data = await request.formData();
		const room_code = String(data.get('room_code'));
		const room = GetRoom(room_code);
		if (room) {
			room.startGame();
		} else {
			throw error(400, { message: 'Cant find room' });
		}
	}
};
