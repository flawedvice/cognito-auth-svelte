<script lang="ts">
	import { initAuth } from '$lib';

	const UserPoolId = 'us-east-1_3xWfO93Z8',
		ClientId = '2h1995lg5871d0gumce6dhjmje';

	initAuth(UserPoolId, ClientId);
</script>

<slot />
