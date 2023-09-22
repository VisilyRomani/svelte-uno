import mongoose from '../mongo';

const Schema = mongoose.Schema;
const RoomSchema = new Schema({
	hostid: String,
	code: { type: String, require: true, unique: true },
	deck: [
		{
			suit: {
				type: String,
				enum: ['R', 'G', 'B', 'Y']
			},
			value: {
				type: String,
				enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'd2', 'wild', 'swap', 'skip']
			}
		}
	],
	discard: [
		{
			suit: {
				type: String,
				enum: ['R', 'G', 'B', 'Y']
			},
			value: {
				type: String,
				enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'd2', 'wild', 'swap', 'skip']
			}
		}
	],
	players: [
		{
			name: String,
			id: String,
			hand: [
				{
					suit: {
						type: String,
						enum: ['R', 'G', 'B', 'Y']
					},
					value: {
						type: String,
						enum: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'd2', 'wild', 'swap', 'skip']
					}
				}
			]
		}
	]
});
export const Room = mongoose.model('Room', RoomSchema);