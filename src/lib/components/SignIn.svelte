<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';

	let classNames = '';
	export { classNames as class };
	export let userType: 'email' | 'username' = 'email';
	export let autocomplete = false;
	export let hidePassword = true;

	const dispatch = createEventDispatcher();
	let username: string, password: string;

	function handleSignIn() {
		dispatch('submit');
		$authStore
			.signIn(username, password)
			.then((res) => {
				dispatch('success', { res });
			})
			.catch((error: Error) => {
				if (error.message === 'newPasswordRequired') {
					needsPasswordReset = true;
					dispatch('passwordReset');
				} else {
					dispatch('error', { error: error.message });
				}
			})
			.finally(() => dispatch('finally'));
	}
</script>

<!--
	@component
	Signs users in your application. Allows customization via the `class` prop.
	The `hidePassword` prop can also be used to show/hide the password field.

	```svelte
	<SignIn
		class=""
		hidePassword={true}
		userType={"email" | "username"}
		autocomplete={false}
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
	>
		<span slot="head|username|password|submit|actions">...</span>
	</SignIn>
	```
-->

<form
	on:submit|preventDefault={handleSignIn}
	class="flex flex-col items-start gap-4 w-1/4 rounded border border-zinc-300 px-12 py-14 {classNames}"
>
	<slot name="head" />
	<label class="flex flex-col w-full">
		<slot name="username">Username</slot>
		{#if userType === 'email'}
			<input
				type="email"
				class="rounded"
				bind:value={username}
				required
				autocomplete={autocomplete ? 'email' : null}
			/>
		{:else}
			<input
				type="text"
				class="rounded"
				bind:value={username}
				required
				autocomplete={autocomplete ? 'username' : null}
			/>
		{/if}
	</label>
	<label class="flex flex-col w-full">
		<slot name="password">Password</slot>
		{#if hidePassword}
			<input type="password" class="rounded" bind:value={password} required />
		{:else}
			<input type="text" class="rounded" bind:value={password} required />
		{/if}
	</label>
	<button type="submit" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
		<slot name="submit">Submit</slot>
	</button>
	<slot name="actions" />
</form>
