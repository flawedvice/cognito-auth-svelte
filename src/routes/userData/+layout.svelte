<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthGuard } from '$lib/components';

	function handleError(event: CustomEvent) {
		console.log(event.detail);
		goto('/');
	}
</script>

<AuthGuard on:error={handleError}>
	Checking
	<slot />
</AuthGuard>
