import mongoose from '../mongo';

const Schema = mongoose.Schema;
const RoomSchema = new Schema({
	room_code: { type: String, require: true, unique: true },
	game: {
		active: {
			suit: String,
			value: String
		},
		started: { type: Boolean, default: false, require: true },
		deck: [
			{
				suit: String,
				value: String,
				id: { type: String, unique: true }
			}
		],
		discard: [
			{
				suit: String,
				value: String,
				id: { type: String, unique: true }
			}
		]
	},
	players: [
		{
			id: { type: String, unique: true },
			name: String,
			order: Number,
			isHost: { default: false, type: Boolean },
			hand: [
				{
					suit: String,
					value: String,
					id: { type: String, unique: true }
				}
			]
		}
	]
});
export const Room = mongoose.model('Room', RoomSchema);
