import { getRoomData } from '$lib/db/controller/RoomController.js';

interface IRoom {
	code: string;
	deck: { suit: string; value: string }[];
	discard: { suit: string; value: string }[];
	hostid: string;
	started: boolean;
	players: {
		name: string;
		id: string;
		hand: { suit: string; value: string }[];
	}[];
}

export const load = async ({ params }) => {
	const room_data = await getRoomData(params.slug);
	params.slug;
	return {
		slug: params.slug,
		data: JSON.parse(room_data) as IRoom
	};
};
