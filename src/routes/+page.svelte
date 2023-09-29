<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import NameModal from '$lib/components/NameModal.svelte';
	import { Player } from '$lib/store/Player';

	let visible = false;
	let player: { name: string; player_id: string };

	Player.subscribe((current) => {
		player = current;
	});
</script>

<main class="container">
	<article>
		<hgroup>
			<h1>W-UNO</h1>
			<h2>Player: {$Player.name}</h2>
		</hgroup>
		<div class="grid-main">
			<form
				method="post"
				action="?/connect"
				use:enhance={(event) => {
					event.formData.append('name', $Player.name);
					event.formData.append('player_id', $Player.player_id);

					return ({ result }) => {
						if (result.type === 'success') {
							goto(String(result.data?.room_code));
						}
					};
				}}
			>
				<label for="room_code">
					Join Room
					<input id="room_code" name="room_code" />
				</label>

				<button class="outline" disabled={!$Player.name}>enter</button>
			</form>
			<div class="divider" />
			<div class="right">
				<form
					method="POST"
					action="?/host"
					use:enhance={(event) => {
						event.formData.append('name', $Player.name);
						event.formData.append('player_id', $Player.player_id);

						return ({ result }) => {
							if (result.type === 'success') {
								goto(String(result?.data?.room_code));
							}
						};
					}}
				>
					<button class="outline" disabled={!$Player.name}>Host</button>
				</form>
			</div>
		</div>
		<div class="setting">
			<button class="outline contrast" on:click={() => (visible = !visible)}> change name </button>
		</div>
	</article>
	<NameModal {visible} />
</main>

<style>
	.divider {
		border-left: 1px solid grey;
		width: 1px;
		margin-left: 1em;
		margin-right: 1em;
	}
	.grid-main {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		margin-bottom: 30px;
	}
	.right {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
</style>
