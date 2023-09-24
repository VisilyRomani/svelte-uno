import { getRoomData } from '$lib/db/controller/RoomController';

export async function POST({ request }) {
	const data = await request.json();
	const roomData = await getRoomData(data.room_code);
	return new Response(JSON.stringify(roomData));
}
