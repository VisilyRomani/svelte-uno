import { getRoomData, startGame } from '$lib/db/controller/RoomController.js';

export const load = async ({ params }) => {
	const room_data = await getRoomData(params.slug);
	params.slug;
	return {
		slug: params.slug,
		data: room_data
	};
};

export const actions = {
	start: async ({ request }) => {
		const data = await request.formData();
		const room = Object.fromEntries(data) as {
			room_code: string;
		};
		console.log;
		startGame(room.room_code);
	}
	// gameData: async ({ request }) => {
	// 	const data = await request.formData();
	// 	const handDraw = Object.fromEntries(data) as {
	// 		id: string;
	// 		room_code: string;
	// 	};
	// }
};
