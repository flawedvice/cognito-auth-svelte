<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';

	export let username: string;
	let classNames = '';
	export { classNames as class };
	export let maxlength = 4;

	const dispatch = createEventDispatcher();

	let code: string;
	function handleConfirm() {
		$authStore
			.confirmSignUp(username, code)
			.then((res) => {
				dispatch('success', { res });
			})
			.catch((error: Error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => dispatch('finally'));
	}
</script>

<form
	on:submit|preventDefault={handleConfirm}
	class="flex flex-col items-start gap-4 rounded border border-zinc-300 px-12 py-14 {classNames}"
>
	<slot name="head" />
	<label class="flex flex-col w-full">
		<slot name="otf">OTF</slot>
		<input type="text" class="rounded" {maxlength} required bind:value={code} />
	</label>

	<button type="submit" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
		<slot name="submit">Submit</slot>
	</button>
	<slot name="actions" />
</form>
