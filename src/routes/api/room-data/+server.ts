import { RoomController } from '$lib/db/controller/RoomController.js';

export async function POST({ request }) {
	const data = await request.json();
	const roomData = await RoomController.getRoomData(data.room_code);
	return new Response(JSON.stringify(roomData));
}
