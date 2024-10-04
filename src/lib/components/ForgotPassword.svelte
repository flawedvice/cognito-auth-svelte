<script lang="ts">
	import { authStore } from '$lib/auth';
	import { createEventDispatcher } from 'svelte';
	import { Eye, EyeOff } from './icons';

	let classNames = '';
	export { classNames as class };
	export let userType: 'email' | 'username' = 'email';
	export let autocomplete = false;
	export let togglePassword = false;

	const dispatch = createEventDispatcher();
	let username: string,
		code: string,
		password: string,
		hidePassword = true,
		step: 'request' | 'confirm' = 'request';

	function handleForgotPassword() {
		dispatch('requestSubmit');
		$authStore
			.forgotPassword(username)
			.then((res) => {
				dispatch('requestSuccess', { res });
				step = 'confirm';
			})
			.catch((error) => {
				dispatch('requestError', { error: error.message });
			})
			.finally(() => {
				dispatch('requestFinally');
			});
	}

	function handleConfirmPassword() {
		dispatch('confirmSubmit');
		$authStore
			.confirmPassword(username, code, password)
			.then((res) => {
				dispatch('confirmSuccess', { res });
			})
			.catch((error) => {
				dispatch('confirmError', { error: error.message });
			})
			.finally(() => {
				dispatch('confirmFinally');
			});
	}

	function handleReset() {
		step = 'request';
	}
</script>

<!--
	@component
	Used when users forget and must restore their passwords. Handles both the request and the confirmation of the new password. Because of this, it's a more complex component.

	Users must be confirmed and have a verified email or SMS attribute.

	```svelte
	<ForgotPassword
		class=""
		userType={"email" | "username"}
		autocomplete={false}
		togglePassword={false}
		on:requestSubmit={handleRequestSubmit}
		on:requestSuccess={handleRequestSuccess}
		on:requestError={handleRequestError}
		on:requestFinally={handleRequestFinally}
		on:confirmSubmit={handleConfirmSubmit}
		on:confirmSuccess={handleConfirmSuccess}
		on:confirmError={handleConfirmError}
		on:confirmFinally={handleConfirmFinally}
	>
		<span slot="head|username|otf|password|back|submit|actions">...</span>
	</ForgotPassword>
	```
-->

{#if step === 'request'}
	<form
		on:submit|preventDefault={handleForgotPassword}
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

		<button type="submit" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
			<slot name="submit">Submit</slot>
		</button>
		<slot name="actions" />
	</form>
{:else}
	<form
		on:submit|preventDefault={handleConfirmPassword}
		on:reset|preventDefault={handleReset}
		class="flex flex-col items-start gap-4 rounded border border-zinc-300 px-12 py-14 {classNames}"
	>
		<slot name="head" />

		<label class="flex flex-col w-full">
			<slot name="otf">OTF</slot>
			<input type="text" class="form-input rounded" required bind:value={code} />
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

		<div class="flex justify-between">
			<button type="reset" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
				<slot name="back">Back</slot>
			</button>
			<button type="submit" class="rounded border border-zinc-300 px-4 py-2 w-fit h-fit">
				<slot name="submit">Submit</slot>
			</button>
		</div>
		<slot name="actions" />
	</form>
{/if}
