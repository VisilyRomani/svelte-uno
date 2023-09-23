<script>
	import { enhance } from '$app/forms';
	import { Player } from '$lib/store/Player';
	import { onMount } from 'svelte';
	import GameState from '$lib/components/GameState.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	onMount(() => {});

	console.log(data);
	const gameStart = data.data?.started;
</script>

{#if gameStart}
	<GameState />
{:else}
	<div class="container">
		<article>
			<div class="grid-main">
				<div>
					<h3>Players</h3>
					{#each data.data.players as player}
						<div>
							<p>{player.name}</p>
						</div>
					{/each}
				</div>
				<h3>code: {data.data.code}</h3>
			</div>
			{#if data.data.hostid === $Player.id}
				<form
					method="post"
					action="?/start"
					use:enhance={(event) => {
						event.formData.append('room_code', data.slug);
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
