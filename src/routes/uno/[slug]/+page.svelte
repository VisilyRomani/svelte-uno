<script lang="ts">
	import { enhance } from '$app/forms';
	import { Player } from '$lib/store/Player';
	import { onMount } from 'svelte';
	import GameState from '$lib/components/GameState.svelte';
	import avatar from 'animal-avatar-generator';
	import ShortUniqueId from 'short-unique-id';
	import { io } from '$lib/socket/socket-client.js';
	import { Game, type GameNotStarted, type GameStarted } from '$lib/api/GameApi.js';
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

	$: is_host = !!room?.players.find((p) => p.player_id === $Player.player_id && p.is_host) || false;
</script>

<svelte:window on:beforeunload={beforeUnload} />
{#if room?.started}
	<GameState code={data.slug} />
{:else if room}
	<div class="container">
		<article>
			<div class="grid-main">
				<div>
					<h3>Players</h3>
					{#each room.players || [] as player}
						<div class="player">
							{@html avatar(player.player_id ?? uid.rnd(4), { size: 50 })}
							<p>{player.name}</p>
						</div>
					{/each}
				</div>
				<h3>code: {data.slug}</h3>
			</div>
			{#if is_host}
				<form
					method="post"
					action="?/start"
					use:enhance={async (event) => {
						loading = true;
						event.formData.append('room_code', data.slug);
						return async ({ result }) => {
							if (result.type === 'success') {
								await refetchRoom();
								io.emit('update', data.slug);
								loading = false;
							}
						};
					}}
				>
					<button aria-busy={loading} disabled={loading}>Start</button>
				</form>
			{/if}
		</article>
	</div>
{/if}

<style>
	.grid-main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	p {
		padding: 0;
		margin: 0;
	}
	.player {
		display: flex;
		gap: 30px;
		align-items: center;
		margin: 10px;
		max-height: 500px;
		overflow-y: auto;
	}
</style>
