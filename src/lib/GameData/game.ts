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
	deck: Card[];
	discard: Card[];
	players: Player[];

	constructor(player: Player) {
		this.started = false;
		this.deck = [...DeckInstance];
		this.discard = [];
		this.current_player = player;
		this.players = [player];
	}

	startGame() {
		this.started = true;
		this.players.map((p, idx) => {
			if (idx + 1 > this.players.length - 1) {
				p.next_player = undefined;
			} else {
				p.next_player = this.players[(idx += 1)];
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
		const prevPlayer = this.players.find((p) => p.next_player?.player_id === player?.player_id);

		if (!player) {
			throw error(404, { message: 'cant find disconnecting player' });
		}

		if (prevPlayer) {
			prevPlayer.next_player = player.next_player;
		}
		if (player.is_host && this.players.length) {
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
}
