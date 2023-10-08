<script lang="ts">
	import { goto } from '$app/navigation';
	import NameModal from '$lib/components/NameModal.svelte';
	import { io } from '$lib/socket/socket-client';
	import { Player } from '$lib/store/Player';

	let visible = false;
	let player: { name: string; player_id: string };

	let roomCodeInput = '';

	Player.subscribe((current) => {
		player = current;
	});

	const JoinRoom = () => {
		io.emit(
			'JOIN-ROOM',
			{ room_code: roomCodeInput, player: $Player },
			(response: { room_code: string }) => {
				goto(response.room_code);
			}
		);
	};

	const HostRoom = () => {
		io.emit('NEW-ROOM', { player: $Player }, (response: { room_code: string }) => {
			goto(response.room_code);
		});
	};
</script>

<main class="container">
	<article>
		<hgroup>
			<h1>W-UNO</h1>
			<h2>Player: {$Player.name}</h2>
		</hgroup>
		<div class="grid-main">
			<div>
				<label for="room_code">
					Join Room
					<input name="room_code" bind:value={roomCodeInput} />
				</label>
				<button class="outline" on:click={JoinRoom} disabled={!$Player.name}>enter</button>
			</div>

			<div class="divider" />
			<div class="right">
				<div>
					<button class="outline" on:click={HostRoom} disabled={!$Player.name}>Host</button>
				</div>
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
