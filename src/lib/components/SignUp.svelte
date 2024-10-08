<script lang="ts">
	import { authStore } from '$lib/auth';
	import { Eye, EyeOff } from './icons';
	import { createEventDispatcher } from 'svelte';

	export let username = '';
	let classNames = '';
	export { classNames as class };
	export let userType: 'email' | 'username' = 'email';
	export let autocomplete = false;
	export let togglePassword = false;

	const dispatch = createEventDispatcher();
	let password: string,
		hidePassword = true;

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
		username=""
		class=""
		userType={"email" | "username"}
		togglePassword={false}
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
	>
		<span slot="head|username|password|submit|actions">...</span>
	</SignUp>
	```
-->

<form
	on:submit|preventDefault={handleSignUp}
	class="flex flex-col items-start gap-4 rounded border border-zinc-300 px-12 py-14 {classNames}"
>
	<slot name="head" />
	<label class="flex flex-col w-full">
		<slot name="username">Username</slot>
		{#if userType === 'email'}
			<input
				type="email"
				class="form-input rounded"
				bind:value={username}
				required
				autocomplete={autocomplete ? 'email' : null}
			/>
		{:else}
			<input
				type="text"
				class="form-input rounded"
				bind:value={username}
				required
				autocomplete={autocomplete ? 'username' : null}
			/>
		{/if}
	</label>
	<label class="relative flex flex-col w-full">
		<slot name="password">Password</slot>
		{#if hidePassword}
			<input type="password" class="form-input rounded" bind:value={password} required />
		{:else}
			<input type="text" class="form-input rounded" bind:value={password} required />
		{/if}
		{#if togglePassword}
			<button
				type="button"
				class="absolute inset-y-8 right-2 w-fit h-fit"
				on:click|preventDefault={() => (hidePassword = !hidePassword)}
			>
				{#if hidePassword}
					<Eye />
				{:else}
					<EyeOff />
				{/if}
			</button>
		{/if}
	</label>
	<button type="submit" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
		<slot name="submit">Submit</slot>
	</button>
	<slot name="actions" />
</form>
