<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';

	let classNames = '';
	export { classNames as class };

	const dispatch = createEventDispatcher();

	function handleSignOut() {
		dispatch('submit');
		$authStore
			.signOut()
			.then((res) => {
				dispatch('success', { res });
			})
			.catch((error: Error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => dispatch('finally'));
	}
</script>

<button on:click={handleSignOut} class={classNames}>
	<slot name="signout">Sign Out</slot>
</button>
