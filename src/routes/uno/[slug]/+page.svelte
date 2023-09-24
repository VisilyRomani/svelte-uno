<script lang="ts">
	import { enhance } from '$app/forms';
	import { Player } from '$lib/store/Player';
	import GameState from '$lib/components/GameState.svelte';
	import { onMount } from 'svelte';
	import { roomData } from '$lib/api/roomData';

	export let data;

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
						<div>
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
						event.formData.append('room_code', data.slug);
						return async ({ result }) => {
							if (result.type === 'success') {
								await refetchRoom();
							}
						};
					}}
				>
					<button>Start</button>
				</form>
			{/if}
		</article>
	</div>{/if}

<style>
	.grid-main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
