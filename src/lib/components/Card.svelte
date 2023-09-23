<script lang="ts">
	export let card: { value: string; suit: string; _id: string };
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
</script>

<article class="card" style={Color()}><h1>{card.value}</h1></article>

<style>
	.card {
		margin: 0;
		padding: 0;
		width: 7em;
		height: 9em;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
	}
	h1 {
		margin: 0;
		font-size: 4em;
		background-color: rgba(0, 0, 0, 0.486);
		padding: 20px;
		border-radius: 10px;
	}
</style>
