import { CreateRoom } from '$lib/GameData/GameController.js';
import { RoomController } from '$lib/db/controller/RoomController.js';
import { error } from '@sveltejs/kit';

export async function GET({ url }) {
	const room_code = url.searchParams.get('room_code');
	if (!room_code) {
		throw error(400, 'Room Code search param misssing');
	}
	CreateRoom({ player_id: '12', name: 'as' });
	const roomData = await RoomController.getRoomData(room_code);
	return new Response(JSON.stringify(roomData));
}
