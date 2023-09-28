<script lang="ts">
	import { enhance } from '$app/forms';
	import { Player } from '$lib/store/Player';
	import { onMount } from 'svelte';
	import GameState from '$lib/components/GameState.svelte';
	import avatar from 'animal-avatar-generator';
	import ShortUniqueId from 'short-unique-id';
	import { io } from '$lib/socket/socket-client.js';
	import { Game, type GameNotStarted, type GameStarted } from '$lib/api/GameApi.js';
	import Lobby from '$lib/components/lobby.svelte';
	const uid = new ShortUniqueId();

	export let data;
	let loading = false;
	let isStarted = false;
	let room: GameNotStarted | GameStarted | undefined;
	let is_host: boolean;

	const refetchRoom = async () => {
		room = await Game.GameData({ player_id: $Player.player_id, room_code: data.slug });
	};

	onMount(async () => {
		refetchRoom();
	});

	io.emit('subscribe', data.slug);

	const beforeUnload = async () => {
		io.emit('unsubscribe', data.slug);
	};

	io.on('reload', (msg: string) => {
		console.log(msg);
		refetchRoom();
	});
</script>

<svelte:window on:beforeunload={beforeUnload} />
{#if room?.started}
	<GameState code={data.slug} />
{:else if !!room}
	<Lobby {room} {refetchRoom} />
{/if}
