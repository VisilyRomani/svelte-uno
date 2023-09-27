import axios from 'axios';

export type GameData = {
	player: {
		player_id: string;
		name: string;
		is_host: true;
		hand: [{ card_id: string; value: string; suit: string }];
		next_player: string;
	};
	current_player: {
		player_id: string;
		next_player: string;
	};
	active: {
		card_id: string;
		value: string;
		suit: string;
	};
	others: [{ amount: number; player_id: string; name: string | undefined }];
};

export const Game = {
	GameData: async ({ player_id, room_code }: { player_id: string; room_code: string }) => {
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
	},
	DrawCard: async (room_code: string) => {
		try {
			const response = await axios.get('/api/draw-card', {
				data: {
					room_code
				}
			});
			return response;
		} catch (err) {
			console.log(err);
		}
	},
	PlayCard: async ({
		room_code,
		card
	}: {
		room_code: string;
		card: { card_id: string; value: string; suit: string };
	}) => {
		console.log(room_code, card);
		try {
			const response = await axios.post('/api/play-card', {
				body: JSON.stringify({
					room_code,
					card
				})
			});
			return response;
		} catch (err) {
			console.log(err);
		}
	}
};
// ⧉
// 		"value": "⇅"
// 		"value": "⍉"
