<script lang="ts">
	import { Player } from '$lib/store/Player';
	import { onMount } from 'svelte';
	import GameState from '$lib/components/GameState.svelte';
	import ShortUniqueId from 'short-unique-id';
	import { io } from '$lib/socket/socket-client.js';
	import { Game, type GameNotStarted, type GameStarted } from '$lib/api/GameApi.js';
	import Lobby from '$lib/components/lobby.svelte';
	const uid = new ShortUniqueId();

	export let data;

	let room: GameNotStarted | GameStarted | undefined;

	const refetchRoom = async () => {
		room = await Game.GameData({ player_id: $Player.player_id, room_code: data.slug });
	};

	onMount(async () => {
		refetchRoom();
	});

	$: data && io.emit('subscribe', data.slug);

	const beforeUnload = () => {
		console.log('unloaded');
		io.emit('unsubscribe', data.slug);
		io.disconnect();
	};

	io.on('reload', (msg: string) => {
		console.log(msg);
		refetchRoom();
	});
</script>

<svelte:window on:beforeunload={beforeUnload} />
{#if room?.started}
	{#key data.url}
		<GameState room_code={data.slug} data={room} {refetchRoom} />
	{/key}
{:else if !!room}
	<Lobby {room} {refetchRoom} />
{/if}
