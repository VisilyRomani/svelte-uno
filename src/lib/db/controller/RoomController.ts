import Deck from '../../Cards.json';
import { Room } from '../model/Room';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

const InitialRoom = async (player: { name: string; id: string }) => {
	const room = await Room.create({
		hostid: player.id,
		code: uid.rnd(4),
		players: [{ name: player.name, id: player.id }]
	});
	return room;
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

export { InitialRoom };
