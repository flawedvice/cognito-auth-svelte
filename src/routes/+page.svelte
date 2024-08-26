<script lang="ts">
	import { goto } from '$app/navigation';
	import { SignIn, SignUp, SignOut, ConfirmSignUp, ResetPassword } from '$lib';

	let loading = false;
	function handleSubmit() {
		loading = true;
		console.log('submit!');
	}
	function handleSuccess(event: CustomEvent) {
		console.log('success!');
		console.log(event.detail);
	}
	function handlePasswordReset(event: CustomEvent) {
		console.log('password reset required!');
		console.log(event.detail);
	}
	function handleError(event: CustomEvent) {
		console.log('error');
		console.log(event.detail);
	}
	function handleFinally(event: CustomEvent) {
		console.log('finally!');
		loading = false;
	}

	let hidePassword = true;
</script>

<main class="flex justify-center my-40">
	<ResetPassword togglePassword />
	<!-- <SignOut on:success={() => console.log('signed out!')} /> -->
	<!-- <SignUp
		on:submit={handleSubmit}
		on:success={handleSuccess}
		on:error={handleError}
		on:finally={handleFinally}
		on:passwordReset={handlePasswordReset}
		togglePassword
		autocomplete
	>
		<div slot="head" class="flex flex-col w-full">
			<div class="h-8 w-8 bg-orange-400 mx-auto"></div>
			<h1 class="text-3xl mb-4">Iniciar Sesión</h1>
		</div>
		<span slot="username">Correo electrónico</span>
		<span slot="password">Contraseña</span>
		<span slot="submit">
			{#if loading}
				loading...
			{:else}
				Ingresar
			{/if}
		</span>
		<div slot="actions" class="flex justify-between w-full text-sm text-zinc-700">
			<a class="link" href="">Crear cuenta</a>
			<a class="link" href="">Olvidé mi contraseña</a>
		</div>
	</SignUp> -->
</main>
