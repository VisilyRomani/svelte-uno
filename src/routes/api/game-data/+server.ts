import { GameController } from '$lib/db/controller/GameController.js';

export async function POST({ request }) {
	const data = await request.json();
	const gameData = await GameController.getGameData({ id: data.id, room_code: data.room_code });
	return new Response(JSON.stringify(gameData));
}
