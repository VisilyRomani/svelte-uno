<script lang="ts">
	import { io } from '$lib/socket/socket-client';
	import avatar from 'animal-avatar-generator';
	import { page } from '$app/stores';
	import { Player } from '$lib/store/Player';
	import type { GameNotStarted } from '$lib/types/GameTypes';
	let loading: boolean;

	export let room: GameNotStarted;

	$: is_host =
		!!room?.players?.find((p) => p.player_id === $Player.player_id && p.is_host) || false;
	$: room_code = String($page.params.slug);

	const StartGame = async () => {
		loading = true;
		io.emit('START-GAME', room_code);
	};
</script>

<div class="container">
	<article>
		<div class="grid-main">
			<div>
				<h3>Players</h3>
				{#each room.players || [] as player}
					<div class="player">
						{@html avatar(player.player_id ?? '', { size: 50 })}
						<p>{player.name}</p>
					</div>
				{/each}
			</div>
			<h3>code: {room_code}</h3>
		</div>
		{#if is_host}
			<button on:click={StartGame} disabled={loading}>Start</button>
		{/if}
	</article>
</div>

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
