<script lang="ts">
	import avatar from 'animal-avatar-generator';
	export let player: { name: string | undefined; player_id: string; amount: number };
	export let active = false;
</script>

<div>
	<h3 class={(active ? 'active' : '') + ' player'}>
		{@html avatar(player.player_id ?? '', { size: 50 })}
		<span class="amount">
			{player.amount}
		</span>
		{player.name}
	</h3>
</div>

<style>
	.player {
		display: inline-block;
		transition: 0.1s ease;
	}
	.amount {
		border: 1px solid whitesmoke;
		padding: 3px;
	}
	.active {
		border-bottom: 3px solid whitesmoke;
		transition: 0.1s ease;
	}
</style>
