import { GameController } from '$lib/db/controller/GameController';

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
		return JSON.stringify(await GameController.startGame(room_code));
	}
};
