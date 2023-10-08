import type { Card } from '../../../socket-server/GameData/game';
import type { Player } from '../../../socket-server/GameData/player';

export interface GameStarted {
	started: true;
	in_play: Card;
	time_last_moved: Date;
	current_player: Player;
	hand: Card[];
	players: {
		player_id: string;
		name: string;
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
