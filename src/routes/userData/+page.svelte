<script lang="ts">
	import { authStore } from '$lib/auth';
	import { onMount } from 'svelte';

	let attrs: unknown;

	onMount(() =>
		$authStore.getAttributes().then((res) => {
			attrs = res;
		})
	);
</script>

<pre>{attrs}</pre>
