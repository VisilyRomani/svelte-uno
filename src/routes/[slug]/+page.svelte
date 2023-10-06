<script lang="ts">
	import { Player } from '$lib/store/Player';
	import { onDestroy, onMount } from 'svelte';
	import GameState from '$lib/components/GameState.svelte';
	import { io } from '$lib/socket/socket-client.js';
	import Lobby from '$lib/components/lobby.svelte';
	import { page } from '$app/stores';
	import type { GameNotStarted, GameStarted } from '$lib/api/GameApi';

	const room_code = $page.params.slug;
	let room: GameNotStarted | GameStarted | undefined;

	io.emit('subscribe', room_code);

	const refetchRoom = async () => {
		io.emit(
			'GET-ROOM-DATA',
			{ room_code, player_id: $Player.player_id },
			(response: { room: GameNotStarted | GameStarted }) => {
				room = response.room;
				console.log(response.room);
			}
		);
	};

	onMount(async () => {
		refetchRoom();
	});

	io.on('FORCE-DATA-UPDATE', () => {
		console.log('force update');
		refetchRoom();
	});

	onDestroy(() => {
		io.emit('unsubscribe', room_code);
	});
</script>

{#if room?.started}
	<GameState {room_code} data={room} {refetchRoom} />
{:else if !!room}
	<Lobby {room} />
{/if}
