export type roomData = {
	started: boolean;
	hostid: string | undefined;
	players: {
		name: string | undefined;
		id: string | undefined;
	}[];
	code: string | undefined;
};

export const roomData = async ({ room_code }: { room_code: string }) => {
	const response = await fetch(`/api/room-data`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ room_code })
	});
	if (!response.ok) {
		throw new Error('Network response was not ok');
	}
	const data = (await response.json()) as roomData;
	return data;
};
