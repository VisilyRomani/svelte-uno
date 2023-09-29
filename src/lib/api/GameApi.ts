import type { Card } from '$lib/GameData/game';
import type { Player } from '$lib/GameData/player';
import axios from 'axios';

export interface GameStarted {
	started: true;
	in_play: Card;
	current_player: Player;
	time_last_moved: Date;
	hand: Card[];
	players: {
		player_id: string;
		name: string;
		is_host: boolean;
		card_count: number;
	}[];
}
export interface GameNotStarted {
	started: false;
	players: {
		player_id: string;
		is_host: boolean;
		name: string;
	}[];
}

export type GameData = GameNotStarted | GameStarted;

export const Game = {
	GameData: async ({ player_id, room_code }: { player_id: string; room_code: string }) => {
		try {
			const { data } = await axios.get<GameNotStarted | GameStarted>('/api/game-data', {
				params: {
					player_id,
					room_code
				}
			});

			return data;
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
