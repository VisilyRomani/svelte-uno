import { GameController } from '$lib/db/controller/GameController.js';

export const ssr = false;
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
		return GameController.startGame(room.room_code);
	}
};
