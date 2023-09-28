import type { Card } from './game';

export class Player {
	player_id: string;
	name: string;
	is_host: boolean;
	next_player: Player | undefined;
	hand: Card[];

	constructor({ player_id, name }: { player_id: string; name: string }, is_host = false) {
		this.player_id = player_id;
		this.name = name;
		this.is_host = is_host;
		this.hand = [];
	}

	setHand(hand: Card[]) {
		this.hand = hand;
	}

	addCard(card: Card) {
		this.hand.push(card);
	}

	removeCard(card: Card) {
		const discard = this.hand.find((c) => c.card_id === card.card_id);
		this.hand = this.hand.filter((c) => c.card_id !== card.card_id);
		return discard;
	}
}
