<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let authenticated = false;
	onMount(() => {
		$authStore
			.getAttributes()
			.then((res) => {
				authenticated = true;
				dispatch('success', { res });
			})
			.catch((error: Error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => dispatch('finally'));
	});
</script>

{#if authenticated}
	<slot />
{/if}
