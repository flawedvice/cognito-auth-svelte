<script lang="ts">
	import { SignUp, SignIn, SignOut } from '$lib';

	let loading = false;
	function handleSubmit() {
		loading = true;
	}
	function handleSuccess(event: CustomEvent) {
		console.log(event.detail);
	}
	function handleError(event: CustomEvent) {
		console.log(event.detail);
	}
	function handleFinally(event: CustomEvent) {
		loading = false;
	}

	let hidePassword = true;
</script>

<main
	style="width: 50%; height: 50%; margin: 200px auto; display: flex; flex-direction: column; gap: 4rem;"
>
	<a href="/userData">UserData</a>

	SignUp
	<SignUp
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
		{hidePassword}
	>
		<span slot="username">Correo</span>
		<span slot="password">Contraseña</span>
		<span slot="submit">
			{#if loading}
				loading...
			{:else}
				Ingresar
			{/if}
		</span>
	</SignUp>

	SignIn
	<SignIn
		class="signIn"
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
		{hidePassword}
	>
		<span slot="username">Correo</span>
		<span slot="password">Contraseña</span>
		<span slot="submit">
			{#if loading}
				loading...
			{:else}
				Ingresar
			{/if}
		</span>
	</SignIn>

	<SignOut
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
	>
		<span slot="signout">
			{#if loading}
				loading...
			{:else}
				Cerrar sesión
			{/if}
		</span>
	</SignOut>
</main>
