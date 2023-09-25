import { Room } from '../model/Room';
import { error } from '@sveltejs/kit';
import Deck from '../../Cards.json';

export const GameController = {
	startGame: async (room_code: string) => {
		const DeckInstance = [...Deck];
		return await Room.findOne({ code: room_code }).then((room) => {
			if (room?.game) {
				room.players.forEach((player, idx) => {
					player.hand.push(...DrawHand(DeckInstance));
					player.order = idx;
				});
				room.game.active = DrawOne(DeckInstance);
				room.game.deck.push(...DeckInstance);
				room.game.started = true;
				room.save();
			}
		});
	}
	// getGameData: async ({ id, room_code }: { id: string; room_code: string }) => {
	// 	return await Room.findOne({ code: room_code }).then((room) => {
	// 		if (room) {
	// 			const Hand = room.players.filter((p) => p.id === id);
	// 			const others = room.players
	// 				.filter((p) => !(p.id === id))
	// 				.map((o) => ({ amount: o.hand.length, id: o.id, name: o.name }));
	// 			return {
	// 				player: {
	// 					id: Hand.at(0)?.id,
	// 					name: Hand.at(0)?.name,
	// 					hand: Hand.at(0)?.hand,
	// 					order: Hand.at(0)?.order
	// 				},
	// 				active: room.game?.active,
	// 				others: others
	// 			};
	// 		} else {
	// 			throw error(404, { message: 'Cant find User Hand' });
	// 		}
	// 	});
	// }
};

const DrawHand = (deck: { suit: string; value: string }[]) => {
	const hand: { suit: string; value: string }[] = [];
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

const DrawOne = (deck: { suit: string; value: string }[]) => {
	let draw: { suit: string; value: string };
	const rand = Math.floor(Math.random() * deck.length);
	if (deck[rand]) {
		deck.splice(rand, 1);
		draw = deck[rand];
		return draw;
	} else {
		console.error('one draw error');
	}
};
