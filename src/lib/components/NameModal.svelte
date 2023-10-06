<script lang="ts">
	import { Player } from '$lib/store/Player';
	export let visible = false;
	const UpdateName = (event: Event) => {
		if (!event.target) {
			return;
		}
		const formData = new FormData(event.target as HTMLFormElement);
		const PlayerName = formData.get('name')?.toString();
		Player.update((cur) => {
			localStorage.setItem('player', JSON.stringify({ ...cur, name: PlayerName ?? '' }));
			return { ...cur, name: PlayerName ?? '' };
		});
		visible = false;
	};
</script>

<dialog open={visible}>
	<article>
		<form on:submit={UpdateName}>
			<label for="name">
				Name
				<input id="name" name="name" />
			</label>
			<footer>
				<button type="button" on:click={() => (visible = false)}>close</button>
				<button>submit</button>
			</footer>
		</form>
	</article>
</dialog>
