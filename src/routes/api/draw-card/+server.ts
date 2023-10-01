import { GetRoom } from '$lib/GameData/GameController.js';
import SuperJSON from 'superjson';

export async function POST({ request }) {
	const { room_code, turn_end }: { room_code: string; turn_end: boolean } = SuperJSON.parse(
		(await request.json()).body
	);
	const room = GetRoom(room_code);
	if (room) {
		room.drawCard(turn_end);
		return new Response('card drawn');
	} else {
		return new Response('missing room');
	}
}
