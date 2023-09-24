<script lang="ts">
	import { enhance } from '$app/forms';
	import { Player } from '$lib/store/Player';
	import { onMount } from 'svelte';
	import { roomData } from '$lib/api/roomData';
	import ShortUniqueId from 'short-unique-id';
	import GameState from '$lib/components/GameState.svelte';
	import avatar from 'animal-avatar-generator';
	const uid = new ShortUniqueId();

	export let data;
	let loading = false;
	let room: roomData;
	let gameStart = false;
	onMount(async () => {
		room = await roomData({ room_code: data.slug });
		gameStart = room.started;
	});

	const refetchRoom = async () => {
		room = await roomData({ room_code: data.slug });
		gameStart = room.started;
	};
</script>

{#if gameStart}
	<GameState code={data.slug} />
{:else if room}
	<div class="container">
		<article>
			<div class="grid-main">
				<div>
					<h3>Players</h3>
					{#each room.players as player}
						<div class="player">
							{@html avatar(player.id ?? uid.rnd(4), { size: 50 })}
							<p>{player.name}</p>
						</div>
					{/each}
				</div>
				<h3>code: {room.code}</h3>
			</div>
			{#if room.hostid === $Player.id}
				<form
					method="post"
					action="?/start"
					use:enhance={async (event) => {
						loading = true;
						event.formData.append('room_code', data.slug);
						return async ({ result }) => {
							if (result.type === 'success') {
								await refetchRoom();
							}
							loading = false;
						};
					}}
				>
					<button aria-busy={loading} disabled={loading}>Start</button>
				</form>
			{/if}
		</article>
	</div>{/if}

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
