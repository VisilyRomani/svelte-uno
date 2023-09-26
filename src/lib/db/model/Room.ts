import mongoose from '../mongo';

const Schema = mongoose.Schema;

const CardSchema = new Schema({
	card_id: { type: String, required: true },
	value: String,
	suit: String
});

const PlayerSchema = new Schema({
	player_id: { type: String, required: true },
	name: String,
	is_host: { default: false, type: Boolean },
	next_player: { type: String },
	hand: { type: [CardSchema], default: [] }
});

const RoomSchema = new Schema({
	room_code: { type: String, required: true, unique: true },
	game: {
		required: true,
		type: {
			active: CardSchema,
			current_player: PlayerSchema,
			started: { type: Boolean, default: false },
			deck: { type: [CardSchema], default: [] },
			discard: { type: [CardSchema], default: [] }
		}
	},
	players: [PlayerSchema]
});
export const Room = mongoose.model('Room', RoomSchema);
