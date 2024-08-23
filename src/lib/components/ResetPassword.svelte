<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';

	let classNames = '';
	export { classNames as class };
	export let hidePassword = true;

	const dispatch = createEventDispatcher();
	let username: string, oldPassword: string;

	let newPassword: string, confirmPassword: string;
	let validPassword = false;

	function validatePasswords() {
		const emptyPasswords = newPassword === '' || confirmPassword === '';
		const equalPasswords = newPassword === confirmPassword;
		console.log('empty:', emptyPasswords, 'equal:', equalPasswords);
		if (!emptyPasswords && equalPasswords) return true;
		else return false;
	}

	$: if (newPassword || confirmPassword) validPassword = validatePasswords();

	function handlePasswordReset() {
		if (!validatePasswords()) {
			dispatch('error', { error: 'invalid password' });
		}
		$authStore
			.passwordResetChallenge(username, newPassword)
			.then((res) => {
				console.log(res);
				dispatch('success', { res });
			})
			.catch((error) => {
				dispatch('error', { error: error.message });
			})
			.finally(() => {
				needsPasswordReset = false;
				dispatch('finally');
			});
	}
</script>

<form
	on:submit|preventDefault={handlePasswordReset}
	class="flex flex-col items-start gap-4 w-1/4 rounded border border-zinc-300 px-12 py-14 {classNames}"
>
	<slot name="head" />
	<label class="flex flex-col w-full">
		<slot name="newPassword">New Password</slot>
		{#if hidePassword}
			<input type="password" class="rounded" bind:value={newPassword} required />
		{:else}
			<input type="text" class="rounded" bind:value={newPassword} required />
		{/if}
	</label>
	<label class="flex flex-col w-full">
		<slot name="confirmPassword">Confirm your Password</slot>
		{#if hidePassword}
			<input type="password" class="rounded" bind:value={confirmPassword} required />
		{:else}
			<input type="text" class="rounded" bind:value={confirmPassword} required />
		{/if}
	</label>
	<button
		type="submit"
		class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit"
		disabled={!validPassword}
	>
		<slot name="submit">Submit</slot>
	</button>
	<slot name="actions" />
</form>
