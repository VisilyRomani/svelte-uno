import { GetRoom } from '$lib/GameData/GameController.js';
import SuperJSON from 'superjson';

export async function GET({ url }) {
	const room_code = String(url.searchParams.get('room_code'));
	const player_id = String(url.searchParams.get('player_id'));

	const room = GetRoom(room_code);

	if (room) {
		return new Response(SuperJSON.stringify(room.gameState(player_id)));
	} else {
		return new Response('missing room');
	}
}
