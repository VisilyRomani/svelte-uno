export type gameData = {
	hand: {
		_id: string;
		suit: string;
		value: string;
	}[];
	id: string;
	name: string;
	order: number;
	others: {
		_id: string;
		name: string;
		amount: number;
	}[];
};
export const gameData = async ({ id, room_code }: { id: string; room_code: string }) => {
	const response = await fetch(`/api/game-data`, {
		method: 'POST',
		body: JSON.stringify({
			id,
			room_code
		})
	});
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	const data = await response.json();
	return data as gameData;
};
