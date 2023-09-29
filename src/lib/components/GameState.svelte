<script lang="ts">
	import { Player } from '$lib/store/Player';
	import Card from './Card.svelte';
	import { Game, type GameStarted } from '$lib/api/GameApi';
	import { onMount } from 'svelte';
	import Opponent from './Opponent.svelte';
	import { io } from '$lib/socket/socket-client';

	let timer = 10;
	export let code: string;
	let data: GameStarted | undefined;
	let hand: { card_id: string; value: string; suit: string }[] = [];
	onMount(async () => {
		try {
			const res = await Game.GameData({ room_code: code, player_id: $Player.player_id });
			if (res?.started) {
				data = res;
			}
			hand = data?.hand ?? [];
		} catch (error) {
			console.log('error');
		}
	});

	io.on('timer', (msg: number) => {
		timer = msg;
	});

	$: console.log(data);
</script>

{#if !data}
	<div aria-busy="true" />
{:else}
	<div class="container">
		<p class="timer">{timer}</p>
		<div class="opponent-container">
			{#each data.players ?? [] as player}
				<Opponent {player} active={player.player_id === data.current_player.player_id} />
			{/each}
		</div>

		<div class="center-container">
			<button class="draw" />
			<Card isHand={true} card={data.in_play} />
		</div>

		<div class="hand-container">
			{#each hand ?? [] as card}
				<Card {card} />
			{/each}
		</div>
	</div>
{/if}

<style>
	.timer {
		position: absolute;
		right: 10px;
		top: 10px;
		width: 100px;
		height: 100px;
		text-align: center;
		font-size: 3em;
		border: 1px solid;
		border-radius: 50%;
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
		width: 100%;
		flex-grow: 1;
		overflow: auto;
		/* padding-left: 60px; */
		/* padding-right: 30px; */
		display: flex;
		justify-content: space-between;
		align-items: end;
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
		width: 100px;
		min-width: 100px;
		height: 150px;
		background-color: rgb(49, 139, 151);
		border-radius: 10px;
		border: 5px solid rgb(129, 129, 129);
		transition: 0.2s ease;
	}
	.draw:hover {
		background-color: rgb(79, 216, 234);
	}
</style>
