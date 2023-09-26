import { GameController } from '$lib/db/controller/GameController.js';
export async function GET({ url }) {
	// const data = await request.json();
	const room_code = String(url.searchParams.get('room_code'));
	const player_id = String(url.searchParams.get('player_id'));

	const gameData = await GameController.getGameData({ player_id: player_id, room_code: room_code });
	console.log(gameData);
	return new Response(JSON.stringify(gameData));
}
