<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';
	import { Eye, EyeOff } from './icons';

	export let username = '';
	let classNames = '';
	export { classNames as class };
	export let userType: 'email' | 'username' = 'email';
	export let autocomplete = false;
	export let togglePassword = false;

	const dispatch = createEventDispatcher();
	let oldPassword: string,
		newPassword: string,
		hideOldPassword = true,
		hideNewPassword = true;

	function handlePasswordReset() {
		dispatch('submit');
		$authStore
			.passwordResetChallenge(username, oldPassword, newPassword)
			.then((res) => {
				dispatch('success', { res });
			})
			.catch((error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => {
				dispatch('finally');
			});
	}
</script>

<!--
	@component
	Used when users require to change their passwords. Especially useful when users were created via Admin API.

	For more common password changes, prefer `ChangePassword`.

	```svelte
	<ResetPassword
		username=""
		class=""
		userType={"email" | "username"}
		autocomplete={false}
		togglePassword={false}
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
	>
		<span slot="head|username|password|submit|actions">...</span>
	</ResetPassword>
	```
-->

<form
	on:submit|preventDefault={handlePasswordReset}
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
		<slot name="oldPassword">Old Password</slot>
		{#if hideOldPassword}
			<input type="password" class="form-input rounded" bind:value={oldPassword} required />
		{:else}
			<input type="text" class="form-input rounded" bind:value={oldPassword} required />
		{/if}

		{#if togglePassword}
			<button
				class="absolute inset-y-8 right-2"
				on:click|preventDefault={() => (hideOldPassword = !hideOldPassword)}
			>
				{#if hideOldPassword}
					<Eye />
				{:else}
					<EyeOff />
				{/if}
			</button>
		{/if}
	</label>
	<label class="relative flex flex-col w-full">
		<slot name="newPassword">New Password</slot>
		{#if hideNewPassword}
			<input type="password" class="form-input rounded" bind:value={newPassword} required />
		{:else}
			<input type="text" class="form-input rounded" bind:value={newPassword} required />
		{/if}

		{#if togglePassword}
			<button
				class="absolute inset-y-8 right-2"
				on:click|preventDefault={() => (hideNewPassword = !hideNewPassword)}
			>
				{#if hideNewPassword}
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
