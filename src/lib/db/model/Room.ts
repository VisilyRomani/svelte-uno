import mongoose from '../mongo';

const Schema = mongoose.Schema;
const RoomSchema = new Schema({
	hostid: String,
	active: {
		suit: String,
		value: String
	},
	code: { type: String, require: true, unique: true },
	started: { type: Boolean, default: false },
	deck: [
		{
			suit: String,
			value: String
		}
	],
	discard: [
		{
			suit: String,
			value: String
		}
	],
	players: [
		{
			name: String,
			id: String,
			order: Number,
			hand: [
				{
					suit: String,
					value: String
				}
			]
		}
	]
});
export const Room = mongoose.model('Room', RoomSchema);
