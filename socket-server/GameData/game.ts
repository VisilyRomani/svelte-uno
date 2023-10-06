import { Player } from './player';
import Cards from './Cards.json';
import ShortUniqueId from 'short-unique-id';
import { error } from '@sveltejs/kit';
const uid = new ShortUniqueId();

export type Card = { value: string; suit: string; card_id: string };

const DeckInstance = Cards.map((d) => ({ ...d, card_id: uid.randomUUID() }));

export class Game {
	started: boolean;
	current_player: Player;
	in_play: Card | undefined;
	has_drawn_card: boolean;
	deck: Card[];
	discard: Card[];
	players: Player[];
	time_last_moved: Date;
	constructor(player: Player) {
		this.started = false;
		this.deck = [...DeckInstance];
		this.has_drawn_card = false;
		this.discard = [];
		this.current_player = player;
		this.players = [player];
		this.time_last_moved = new Date();
	}

	startGame() {
		this.started = true;
		this.time_last_moved = new Date();
		this.players.map((p, idx) => {
			if (idx + 1 > this.players.length - 1) {
				p.setNextPlayer(this.players.at(0));
			} else {
				p.setNextPlayer(this.players[(idx += 1)]);
			}

			p.setHand(this.drawRandomCard(7));
		});

		const card = this.drawRandomCard(1);
		if (card.length) {
			this.in_play = card.at(0);
			console.log(this.in_play);
		} else {
			throw error(404, { message: 'Set inital in play error' });
		}
	}

	drawRandomCard(cardAmount: number) {
		let i = 0;
		const cardStack: { suit: string; value: string; card_id: string }[] = [];

		while (i < cardAmount) {
			const rand = Math.floor(Math.random() * this.deck.length);
			if (this.deck[rand]) {
				cardStack.push(this.deck[rand]);
				this.deck.splice(rand, 1);
			} else {
				throw error(404, { message: 'Draw random card error' });
			}
			i++;
		}
		return cardStack;
	}

	gameState(player_id: string) {
		if (!this.started) {
			return {
				started: this.started,
				players: this.players.map((p) => ({
					player_id: p.player_id,
					is_host: p.is_host,
					name: p.name
				}))
			};
		} else {
			return {
				started: this.started,
				in_play: this.in_play,
				time_last_moved: this.time_last_moved,
				current_player: this.current_player,
				hand: this.players.find((p) => p.player_id === player_id)?.hand,
				players: [
					...this.players
						.filter((p) => {
							return p.player_id !== player_id;
						})
						.map((p) => ({
							player_id: p.player_id,
							name: p.name,
							card_count: p.hand.length
						}))
				]
			};
		}
	}

	playerDisconnect(player_id: string) {
		const player = this.players.find((p) => p.player_id === player_id);
		this.players = this.players.filter((p) => p.player_id !== player_id);
		const prevPlayer = this.players.find((p) => p.getNextPlayer()?.player_id === player?.player_id);
		if (!player) {
			return;
		}

		if (this.current_player.player_id === player_id) {
			const nextPlayer = player.getNextPlayer();
			if (nextPlayer) {
				this.current_player = nextPlayer;
			}
		}
		if (prevPlayer) {
			prevPlayer.setNextPlayer(player.getNextPlayer());
		}
		if (player?.is_host && this.players.length) {
			this.players[0].is_host = true;
		}
	}

	playerCount() {
		return this.players.length;
	}

	playerJoin(player: { player_id: string; name: string }) {
		const newPlayer = new Player(player);
		this.players.push(newPlayer);
	}

	playCard({
		card_id,
		value,
		suit,
		player_id,
		selected_suit
	}: {
		card_id: string;
		value: string;
		suit: string;
		player_id: string | undefined;
		selected_suit: string | undefined;
	}) {
		const index = this.current_player.hand.findIndex((c) => c.card_id === card_id);
		const discard = this.current_player.hand.splice(index, 1);
		switch (value) {
			case '⍉': {
				const skipPlayer = this.current_player.getNextPlayer()?.getNextPlayer();
				if (skipPlayer) {
					this.current_player = skipPlayer;
					this.in_play = discard.at(0);
					this.time_last_moved = new Date();
				} else {
					console.error('SKIP ERROR: no next player ');
				}
				break;
			}
			case '⧉': {
				this.current_player.getNextPlayer()?.addCard(this.drawRandomCard(2));
				this.setNextPlayer();
				this.time_last_moved = new Date();
				break;
			}
			case '⇅': {
				const discard = this.current_player.hand.splice(index, 1);
				this.in_play = discard.at(0);
				const player = this.players.find((p) => p.player_id === player_id);
				if (player) {
					const current_hand = [...this.current_player.hand];
					this.current_player.setHand(player?.hand.length ? [...player.hand] : []);
					player.setHand(current_hand);
					this.setNextPlayer();
					this.time_last_moved = new Date();
				} else {
					console.error('SWAP ERROR: selected player not found');
				}
				break;
			}
			case 'wild': {
				const discard = this.current_player.hand.splice(index, 1);
				this.in_play = {
					suit: selected_suit || suit,
					value: discard.at(0)?.value || value,
					card_id
				};
				this.setNextPlayer();
				this.time_last_moved = new Date();
				break;
			}
			default: {
				const discard = this.current_player.hand.splice(index, 1);
				this.in_play = discard.at(0);
				this.setNextPlayer();
				this.time_last_moved = new Date();
			}
		}
	}

	drawCard(force_draw: boolean) {
		const card = this.drawRandomCard(1);
		this.current_player.addCard(card);
		this.has_drawn_card = true;

		const available_card = this.current_player.hand.filter((c) => {
			if (c.suit === this.in_play?.suit || c.value == this.in_play?.value || c.value === 'wild') {
				return true;
			} else {
				return false;
			}
		});
		if (!available_card.length || force_draw) {
			this.setNextPlayer();
		}
	}

	setNextPlayer() {
		const nextPlayer = this.current_player.getNextPlayer();
		if (nextPlayer) {
			this.current_player = nextPlayer;
		} else {
			console.error('missing next player');
		}
		this.time_last_moved = new Date();
	}
}
