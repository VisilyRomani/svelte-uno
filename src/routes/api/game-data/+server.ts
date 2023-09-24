import { getGameData } from '$lib/db/controller/RoomController';

export async function POST({ request }) {
	const data = await request.json();
	const gameData = await getGameData({ id: data.id, room_code: data.room_code });
	return new Response(JSON.stringify(gameData));
}
