import { Room } from '../model/Room';
import Deck from '../../Cards.json';
import { error } from '@sveltejs/kit';
import ShortUniqueId from 'short-unique-id';
import type { drawType } from '../../../routes/api/play-card/+server';
const uid = new ShortUniqueId();

export const GameController = {
	startGame: async (room_code: string) => {
		const DeckInstance = Deck.map((d) => ({ ...d, card_id: uid.randomUUID() }));
		const room = await Room.findOne({ room_code: room_code }).exec();
		if (!room) {
			return error(404, { message: 'Room not found' });
		}
		for (const player of room.players) {
			const current = room.players.indexOf(player);
			player.hand.push(...DrawHand(DeckInstance));
			if (current !== room.players.length + 1) {
				player.next_player = room.players[0].player_id;
			} else {
				player.next_player = room.players[current + 1].player_id;
			}

			if (player.is_host) {
				room.game.current_player = player;
			}
		}
		room.game.active = DrawOne(DeckInstance);
		room.game.deck.push(...DeckInstance);
		room.game.started = true;
		await room.save();
		return room;
	},
	getGameData: async ({ player_id, room_code }: { player_id: string; room_code: string }) => {
		const room = await Room.findOne({ room_code: room_code }).exec();

		if (!room) {
			throw error(404, { message: 'Cant find User Hand' });
		}
		const player = room.players.find((p) => p.player_id === player_id);

		const others = room.players
			.filter((p) => !(p.player_id === player_id))
			.map((o) => ({ amount: o.hand.length, player_id: String(o.player_id), name: o.name }));

		// eslint-disable-next-line @typescript-eslint/no-unused-vars

		return {
			player,
			current_player: {
				player_id: room.game.current_player?.player_id,
				next_player: room.game.current_player?.next_player
			},
			active: room.game.active,
			others: others
		};
	},
	playCard: async ({ room_code, card }: drawType) => {
		const room = await Room.findOne({ room_code: room_code });

		if (!room) {
			throw error(404, { message: 'Cant find room when playing card' });
		}

		if (
			room.game.active?.suit === card.suit ||
			room.game.active?.value === card.value ||
			card.value === 'wild'
		) {
			switch (card.value) {
				case '⧉':
					break;
				case '⇅':
					break;
				case '⍉':
					break;
				case 'wild':
					break;
				default:
					break;
			}
		}
	}
};

const DrawHand = (deck: { card_id: string; suit: string; value: string }[]) => {
	const hand: { suit: string; value: string; card_id: string }[] = [];
	let i = 0;
	while (i <= 6) {
		const rand = Math.floor(Math.random() * deck.length);
		if (deck[rand]) {
			hand.push(deck[rand]);
			deck.splice(rand, 1);
		} else {
			console.error('hand draw error');
		}
		i++;
	}
	return hand;
};

const DrawOne = (deck: { suit: string; value: string; card_id: string }[]) => {
	let draw: { suit: string; value: string; card_id: string };
	const rand = Math.floor(Math.random() * deck.length);
	if (deck[rand]) {
		deck.splice(rand, 1);
		draw = deck[rand];
		return draw;
	} else {
		console.error('one draw error');
	}
};
