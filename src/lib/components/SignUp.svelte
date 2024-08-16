<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';

	let classNames = '';
	export { classNames as class };
	export let hidePassword = true;

	const dispatch = createEventDispatcher();
	let username: string, password: string;

	function handleSignUp() {
		dispatch('submit');
		$authStore
			.signUp(username, password)
			.then((res) => {
				dispatch('success', { res });
			})
			.catch((error: Error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => dispatch('finally'));
	}
</script>

<!--
	@component
	Signs users up your application. Allows customization via the `class` prop.
	The `hidePassword` prop can also be used to show/hide the password field.

	```svelte
	<SignUp
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
	>
		<span slot="username|password|submit">...</span>
	</SignUp>
	```
-->

<form on:submit|preventDefault={handleSignUp} class={classNames}>
	<label>
		<slot name="username">Username</slot>
		<input type="email" bind:value={username} required />
	</label>
	<label>
		<slot name="password">Password</slot>
		{#if hidePassword}
			<input type="password" bind:value={password} required />
		{:else}
			<input type="text" bind:value={password} required />
		{/if}
	</label>
	<button type="submit">
		<slot name="submit">Submit</slot>
	</button>
</form>
