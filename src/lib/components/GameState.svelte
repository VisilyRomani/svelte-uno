<script lang="ts">
	import { Player } from '$lib/store/Player';
	import Card from './Card.svelte';
	import { Game, type GameStarted } from '$lib/api/GameApi';
	import Opponent from './Opponent.svelte';
	import { io } from '$lib/socket/socket-client';
	import { onDestroy, onMount } from 'svelte';

	export let refetchRoom: () => Promise<void>;
	export let room_code: string;
	export let data: GameStarted;

	const player_timer = 5;
	let time_last = 0;
	$: hand = data.hand;
	let interval_id: NodeJS.Timeout;

	io.on('player_countdown', (msg: number) => {
		time_last = msg;
	});

	const endTurn = async () => {
		time_last = 0;
		await Game.DrawCard(room_code, true);
		await refetchRoom();
		io.emit('update', room_code);
	};

	// onMount(() => {});
	// onDestroy(() => {
	// 	clearTimeout(interval_id);
	// });

	// // Move timer into server component
	// const Timer = async () => {
	// 	time_last = (new Date().getTime() - new Date(data.time_last_moved).getTime()) / 1000;

	// 	if (data.current_player.player_id === $Player.player_id) {
	// 		if (player_timer - time_last < 0) {
	// 			await endTurn();
	// 		} else {
	// 			io.emit('timer', { room_code, time_last: time_last });
	// 			setTimeout(Timer, 500);
	// 		}
	// 	} else {
	// 		clearTimeout(interval_id);
	// 	}
	// };
	// $: interval_id = setTimeout(Timer, 500);

	// $: console.log(player_timer - time_last);

	io.on('success', (msg) => {
		console.log(msg);
	});
</script>

<button
	on:click={() => {
		io.emit('test', room_code);
	}}>test</button
>

{#if !data}
	<div aria-busy="true" />
{:else}
	<div class="container">
		<progress class="timer" value={player_timer - time_last} max="30" />
		<div class="opponent-container">
			{#each data.players ?? [] as player}
				<Opponent {player} active={player.player_id === data.current_player.player_id} />
			{/each}
		</div>

		<div class="center-container">
			<button
				class="draw"
				on:click={() => {
					Game.DrawCard(room_code, false);
				}}
			/>
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
