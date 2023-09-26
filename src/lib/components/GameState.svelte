<script lang="ts">
	import { Player } from '$lib/store/Player';
	import Card from './Card.svelte';
	import { gameData, type GameData } from '$lib/api/gameData';
	import { onMount } from 'svelte';
	import Opponent from './Opponent.svelte';

	export let code: string;
	let data = {} as GameData | undefined;
	let hand: { card_id: string; value: string; suit: string }[] = [];
	let toggle = false;
	onMount(async () => {
		try {
			data = await gameData({ room_code: code, player_id: $Player.player_id });
			hand = data?.player.hand ?? [];
		} catch (error) {}
	});
</script>

{#if !data}
	<div aria-busy="true" />
{:else}
	<div class="container">
		<div class="opponent-container">
			{#each data.others ?? [] as other}
				<Opponent player={other} active={toggle} />
			{/each}
		</div>

		<div class="hand-container">
			{#each hand ?? [] as card}
				<Card {card} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.container {
		all: unset;
		height: 100vh;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}
	.hand-container {
		width: 100%;
		flex-grow: 1;
		overflow: auto;
		padding-left: 60px;
		padding-right: 30px;
		display: flex;
		justify-content: center;
		align-items: end;
	}
	.opponent-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 1em;
	}
</style>
