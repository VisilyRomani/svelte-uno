<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import NameModal from '$lib/components/NameModal.svelte';
	import { Player } from '$lib/store/Player';

	let visible = false;
	let player: { name: string; id: string };

	Player.subscribe((current) => {
		player = current;
	});
</script>

<main class="container">
	<article>
		<hgroup>
			<h1>Uno</h1>
			<h2>Player: {$Player.name}</h2>
		</hgroup>
		<div class="grid-main">
			<form
				method="post"
				use:enhance={(event) => {
					event.formData.append('name', $Player.name);
					event.formData.append('id', $Player.id);

					return ({ result }) => {
						if (result.type === 'success') {
							goto('/uno/' + result?.data?.room_code);
						}
					};
				}}
				action="?/connect"
			>
				<label for="room_code">
					Join Room
					<input id="room_code" name="room_code" />
				</label>

				<button disabled={!$Player.name}>enter</button>
			</form>
			<div class="divider" />
			<div class="right">
				<form
					method="POST"
					action="?/host"
					use:enhance={(event) => {
						event.formData.append('name', $Player.name);
						event.formData.append('id', $Player.id);

						return ({ result }) => {
							if (result.type === 'success') {
								goto('/uno/' + result?.data?.room_code);
							}
						};
					}}
				>
					<button disabled={!$Player.name}>Host</button>
				</form>
			</div>
		</div>
	</article>
	<div class="setting">
		<button on:click={() => (visible = !visible)}> change name </button>
	</div>
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
	}
	.right {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
</style>
