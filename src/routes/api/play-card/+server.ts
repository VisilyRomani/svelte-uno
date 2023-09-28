export type drawType = {
	room_code: string;
	card: {
		card_id: string;
		value: string;
		suit: string;
	};
};
export async function POST({ request }) {
	const data = await request.json();
	const { card, room_code }: drawType = JSON.parse(data.body);

	return new Response();
}
