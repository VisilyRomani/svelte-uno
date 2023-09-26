import axios from 'axios';

export type GameData = {
	player: {
		player_id: string;
		name: string;
		is_host: true;
		hand: [{ card_id: string; value: string; suit: string }];
		next_player: string;
	};
	active: {
		card_id: string;
		value: string;
		suit: string;
	};
	others: [{ amount: number; player_id: string; name: string | undefined }];
};
export const gameData = async ({
	player_id,
	room_code
}: {
	player_id: string;
	room_code: string;
}) => {
	try {
		const response = await axios.get<GameData>('/api/game-data', {
			params: {
				player_id,
				room_code
			}
		});

		return response.data;
	} catch (err) {
		console.log(err);
	}
};
