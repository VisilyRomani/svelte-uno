<script lang="ts">
	import { page } from '$app/stores';
	import { io } from '$lib/socket/socket-client';
	import { Player } from '$lib/store/Player';

	export let isHand = false;
	export let card: { value: string; suit: string; card_id: string };
	export const disabled: boolean = false;
	const room_code = $page.params.slug;

	const Color = () => {
		if (card.suit === 'R') {
			return 'background-color: rgb(255, 114, 114)';
		} else if (card.suit === 'G') {
			return 'background-color: rgb(114, 255, 156)';
		} else if (card.suit === 'B') {
			return 'background-color: rgb(114, 137, 255)';
		} else if (card.value === 'wild') {
			return 'background-color: black';
		} else {
			return 'background-color: rgb(243, 255, 114)';
		}
	};

	const PlayCard = async () => {
		if (isHand && !disabled) {
			io.emit('PLAY-CARD', { ...card, room_code, player: $Player, selected_suit: '' });
			// await Game.PlayCard({ room_code: $page.data.slug, card });
		}
	};
</script>

<button on:click={() => PlayCard()} class={`${!isHand ? 'disable' : 'hand'} card`} style={Color()}>
	<h1>{card.value}</h1>
</button>

<style>
	.card {
		all: unset;
		margin: 0;
		padding: 0;
		--width: 5em;
		--height: calc(var(--width) * 1.4);
		min-width: var(--width);
		height: var(--height);
		border-radius: 10px;
		z-index: 1;
		border: 5px solid rgb(129, 129, 129);
		user-select: none;
		transition: 0.3s ease;
		&:not(.disable):hover,
		&:not(.disable):active {
			transform: translateY(-30px);
			z-index: 99;
		}
	}

	h1 {
		margin: 0;
		padding: 0;
		font-size: 2em;
		text-wrap: nowrap;
		text-align: center;
		-webkit-text-stroke: 1px rgb(65, 65, 65);
	}
</style>
