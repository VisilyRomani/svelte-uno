import { error } from '@sveltejs/kit';
import Deck from '../../Cards.json';
import { Room } from '../model/Room';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();

const initialRoom = async (player: { name: string; id: string }) => {
	const room = await Room.create({
		hostid: player.id,
		code: uid.rnd(4),
		players: [{ name: player.name, id: player.id }]
	});
	return room;
};

const getRoomData = async (room_code: string) => {
	const data = await Room.findOne({ code: room_code });
	if (data) {
		return {
			started: data.started,
			hostid: data.hostid,
			players: data.players.map((p) => ({ name: p.name, id: p.id })),
			code: data.code
		};
	} else {
		throw error(404, { message: "Can't find room data" });
	}
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
		if (room) {
			if (room.started) {
				throw error(405, { message: 'game is started' });
			}
			if (!room.players.find((i) => i.id === id)) {
				room.players.push({ name: name, id: id, hand: [] });
				room.save();
				return { room_code: room.code };
			} else {
				throw error(404, { message: 'not found' });
			}
		}
	});
};

const startGame = async (room_code: string) => {
	const DeckInstance = [...Deck];
	return await Room.findOne({ code: room_code }).then((room) => {
		if (room) {
			room.players.forEach((player, idx) => {
				player.hand.push(...DrawHand(DeckInstance));
				player.order = idx;
			});
			room.active = DrawOne(DeckInstance);
			room.deck.push(...DeckInstance);
			room.started = true;
			room.save();
		}
	});
};

const getGameData = async ({ id, room_code }: { id: string; room_code: string }) => {
	return await Room.findOne({ code: room_code }).then((room) => {
		if (room) {
			const Hand = room.players.filter((p) => p.id === id);
			const others = room.players
				.filter((p) => !(p.id === id))
				.map((p) => ({ ...p, hand: p.hand.length }));

			return {
				hand: Hand.at(0)?.hand,
				id: Hand.at(0)?.id,
				name: Hand.at(0)?.name,
				order: Hand.at(0)?.order,
				others: others
			};
		} else {
			throw error(404, { message: 'Cant find User Hand' });
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

export { initialRoom, getRoomData, joinRoom, startGame, getGameData };
