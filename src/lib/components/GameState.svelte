<script lang="ts">
	import { Player } from '$lib/store/Player';
	import Card from './Card.svelte';
	import { gameData } from '$lib/api/gameData';
	import { onMount } from 'svelte';

	export let code: string;
	let data = {} as gameData;

	onMount(async () => {
		try {
			data = await gameData({ room_code: code, id: $Player.id });
		} catch (error) {
			// Handle the error, e.g., show an error message to the user
		}
	});
</script>

<div class="hand-container">
	{#each data?.hand ?? [] as card}
		<Card {card} />
	{/each}
</div>

<style>
	.hand-container {
		width: 100%;
		overflow: auto;
		padding-left: 60px;
		padding-right: 30px;
		display: flex;
		height: 100vh;
		justify-content: center;
		align-items: end;
	}
</style>
