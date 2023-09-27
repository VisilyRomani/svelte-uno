import axios from 'axios';

export type RoomData = {
	started: boolean | undefined;
	players: {
		name: string | undefined;
		player_id: string | undefined;
		is_host: boolean;
	}[];
	room_code: string | undefined;
};

export const Room = {
	RoomData: async ({ room_code }: { room_code: string }) => {
		try {
			const response = await axios.get<RoomData>('/api/room-data', {
				params: {
					room_code
				}
			});
			return response.data;
		} catch (err) {
			console.error(err);
		}
	}
};
