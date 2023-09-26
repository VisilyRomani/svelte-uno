import { writable } from 'svelte/store';
import ShortUniqueId from 'short-unique-id';
import { browser } from '$app/environment';
const uid = new ShortUniqueId();

const GetPlayer = () => {
	const newPlayer = { name: '', player_id: uid.rnd() };
	if (browser) {
		const playerData = localStorage.getItem('player');
		if (playerData) {
			return JSON.parse(playerData);
		} else {
			localStorage.setItem('player', JSON.stringify(newPlayer));
			return newPlayer;
		}
	} else {
		return newPlayer;
	}
};

export const Player = writable<{ player_id: string; name: string }>(GetPlayer());
