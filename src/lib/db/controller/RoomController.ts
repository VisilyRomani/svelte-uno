import { error } from '@sveltejs/kit';
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

const getRoomData = async (room_code: string) => {
	return JSON.stringify(await Room.findOne({ code: room_code }));
};

const joinRoom = async ({
	room_code,
	name,
	id
}: {
	room_code: string;
	name: string;
	id: string;
}) => {
	return await Room.findOne({ code: room_code }).then((room) => {
		if (room && !room.players.find((i) => i.id === id)) {
			room.players.push({ name: name, id: id, hand: [] });
			room.save();
			return { room_code: room.code };
		} else {
			throw error(404, { message: 'not found' });
		}
	});
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

export { InitialRoom, getRoomData, joinRoom };
