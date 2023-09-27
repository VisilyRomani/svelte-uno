<script lang="ts">
	import { page } from '$app/stores';
	import { Game } from '$lib/api/GameApi';

	export let card: { value: string; suit: string; card_id: string };
	const Color = () => {
		if (card.suit === 'R') {
			return 'background-color: rgb(255, 114, 114)';
		} else if (card.suit === 'G') {
			return 'background-color: rgb(114, 255, 156)';
		} else if (card.suit === 'B') {
			return 'background-color: rgb(114, 137, 255)';
		} else {
			return 'background-color: rgb(243, 255, 114)';
		}
	};
	// console.log($page.data.slug);

	const PlayCard = async () => {
		await Game.PlayCard({ room_code: $page.data.slug, card });
	};
</script>

<button on:click={() => PlayCard()} class="card" style={Color()}>
	<h1>{card.value}</h1>
</button>

<style>
	.card {
		margin: 0;
		padding: 0;
		width: 100px;
		min-width: 100px;
		height: 150px;
		border-radius: 10px;
		margin-left: -30px;
		transition: 0.3s ease;
		z-index: 1;
		border: 5px solid rgb(129, 129, 129);
		user-select: none;
	}
	button {
		all: unset;
	}

	.card:hover,
	.card:active {
		transform: translateY(-30px);
		z-index: 99;
	}
	h1 {
		margin: 0;
		padding: 0;
		font-size: 45px;
		text-align: center;
		-webkit-text-stroke: 2px rgb(65, 65, 65);
	}
</style>
