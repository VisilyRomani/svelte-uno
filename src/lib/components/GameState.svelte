<script lang="ts">
	import { Player } from '$lib/store/Player';
	import Card from './Card.svelte';
	import Opponent from './Opponent.svelte';
	import { io } from '$lib/socket/socket-client';
	import type { GameStarted } from '$lib/types/GameTypes';
	import { onMount } from 'svelte';

	export let data: GameStarted;
	let time = 0;

	io.on('TIMER', (msg: number) => {
		time = msg;
	});

	let parentEl: HTMLElement | null;
	onMount(() => {
		parentEl = document.getElementById('hand-container');
	});
	function sortCards() {
		let cards = document.getElementsByClassName('hand'),
			cw = parentEl?.clientWidth ?? 0,
			sw = parentEl?.scrollWidth ?? 0,
			diff = sw - cw,
			offset = diff / (cards.length - 1);
		console.log(cards);

		for (let i = 1; i < cards.length; i++) {
			(cards[i] as HTMLElement).style.transform = 'translateX(-' + 50 * i + 'px)';
		}
	}
	// $: if (data.hand || parentEl) sortCards();
</script>

{#if !data}
	<div aria-busy="true" />
{:else}
	<div class="container">
		<progress class="timer" value={time} max="30" />
		<div class="opponent-container">
			{#each data.players ?? [] as player}
				<Opponent {player} active={player.player_id === data.current_player.player_id} />
			{/each}
		</div>

		<div class="center-container">
			<button class="draw" on:click={() => {}} />
			<Card disabled={true} isHand={true} card={data.in_play} />
		</div>

		<div class="hand-container" id="hand-container">
			{#each data.hand ?? [] as card}
				<Card
					isHand={true}
					{card}
					disabled={!($Player.player_id === data.current_player.player_id)}
				/>
			{/each}
		</div>
	</div>
{/if}

<style>
	progress {
		transition: width 5s ease;
	}
	.center-container {
		display: flex;
		justify-content: center;
	}
	.container {
		all: unset;
		height: 100vh;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
	}
	.hand-container {
		display: flex;
		align-self: center;
	}
	.opponent-container {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 1em;
	}
	.draw {
		all: unset;
		margin: 0;
		padding: 0;
		--width: 5em;
		--height: calc(var(--width) * 1.4);
		width: var(--width);
		height: var(--height);
		background-color: rgb(49, 139, 151);
		border-radius: 10px;
		border: 5px solid rgb(129, 129, 129);
		transition: 0.2s ease;
	}
	.draw:hover {
		background-color: rgb(79, 216, 234);
	}
</style>
