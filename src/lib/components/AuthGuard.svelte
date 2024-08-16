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

<!--
	@component
	Check whether a user is authenticated. Use it to protect your routes by placing it at any `+layout.svelte` file as:

	```svelte
	<AuthGuard on:success={redirectUser} on:error={redirectGuest} on:finally={stopLoader} >
		<slot />
	</AuthGuard>
	```
-->

{#if authenticated}
	<slot />
{/if}
