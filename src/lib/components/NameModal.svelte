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
			return { ...cur, name: PlayerName ?? '' };
		});
		visible = false;
	};
</script>

<dialog open={visible}>
	<form on:submit={UpdateName}>
		<label for="name">
			Name
			<input id="name" name="name" />
		</label>
		<button>submit</button>
	</form>
</dialog>
