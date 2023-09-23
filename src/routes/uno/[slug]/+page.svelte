<script>
	/** @type {import('./$types').PageData} */
	export let data;
	console.log(data);
	const gameStart = data.data.started;
</script>

{#if gameStart}
	<div>Show game State</div>
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
			<button>Start</button>
		</article>
	</div>{/if}

<style>
	.grid-main {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
</style>
