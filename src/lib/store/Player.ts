import { writable } from 'svelte/store';
import ShortUniqueId from 'short-unique-id';
const uid = new ShortUniqueId();
export const Player = writable({ name: '', id: uid.rnd() });
