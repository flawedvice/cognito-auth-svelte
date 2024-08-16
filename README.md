# Cognito Auth

This library provides components and methods to allow a fast implementation of AWS Cognito authentication in Svelte applications.

It's optimized to work on the frontend!

## Usage

First of all, initiate the auth stores using the `initAuth` method at the root `+layout.svelte` file:

```svelte
<script lang="ts">
	import { initAuth } from 'cognito-auth';

	const userPoolId = '...',
		clientId = '...';

	initAuth(userPoolId, clientId);
</script>

<slot />
```

Then, you can start using the library's custom components:

```html
<script lang="ts">
	import { SignIn } from 'cognito-auth';

	// ...
</script>

<SignIn
	class="signIn"
	on:submit="{handleSubmit}"
	on:success="{handleSuccess}"
	on:error="{handleError}"
	on:finally="{handleFinally}"
	{hidePassword}
>
	<span slot="username">Your Username</span>
	<span slot="password">Your Password</span>
	<span slot="submit"> {#if loading} loading... {:else} Sign In {/if} </span>
</SignIn>
```

If needed, you can also access the `authStore` store to access specific user data, available when the user is authenticated.

## Notes

This library aims to keep things simple and provide functionality over all things.

It might provide some minimal styles using TailwindCSS classes to streamline its implementation into your application.
