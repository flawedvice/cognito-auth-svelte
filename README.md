# Cognito Auth

This library provides components and methods to allow a fast implementation of AWS Cognito authentication in Svelte applications.

It's optimized to work on the frontend!

## Install

```bash
npm i cognito-auth-svelte
```

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

Note that you can store your credentials at an `.env` file using `VITE_` as a prefix on your variable names so they can be processed at compile time:

```env
# .env
VITE_USERPOOL_ID="..."
VITE_CLIENT_ID="..."
```

```svelte
<!-- +layout.svelte -->
<script lang="ts">
	import { initAuth } from 'cognito-auth';

	const userPoolId = import.meta.env.VITE_USERPOOL_ID,
		clientId = import.meta.env.VITE_CLIENT_ID;

	initAuth(userPoolId, clientId);
</script>

<slot />
```

> source: https://vitejs.dev/guide/env-and-mode.html#env-files

Then, you can start using the library's custom components:

```svelte
<script lang="ts">
	import { SignIn } from 'cognito-auth';

	// ...
</script>

<SignIn
	class="signIn"
	on:submit={handleSubmit}
	on:success={handleSuccess}
	on:error={handleError}
	on:finally={handleFinally}
	togglePassword
>
	<span slot="username">Your Username</span>
	<span slot="password">Your Password</span>
	<span slot="submit">
		{#if loading}
			loading...
		{:else}
			Sign In
		{/if}
	</span>
</SignIn>
```

If needed, you can also access the `authStore` store to retrieve specific user data, available when the user is authenticated.

## Available components

| Component      | Usage                                                                                                                 |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| AuthGuard      | Set at any `+layout.svelte` file to protect its child pages from unauthenticated users.                               |
| SignIn         | Lets users sign into your Cognito Userpool.                                                                           |
| SignUp         | Lets users sign up to your Cognito Userpool.                                                                          |
| ConfirmSignUp  | Used to send confirmation codes. Requires a username!                                                                 |
| ResetPassword  | Allows users to change their password when required to. Use when users are created via Admin API.                     |
| ChangePassword | Allows users to change their password when authenticated. If prompted by Cognito, prefer `ResetPassword`.             |
| ForgotPassword | Allows users to start the "forgot password" flow. Users must be confirmed and have a verified email or SMS attribute. |
| SignOut        | Signs users out of your Cognito Userpool.                                                                             |

Some of those components emit custom events:
| Component | Submit | Success | Error | Finally | Other |
| --------- | ------ | ------- | ----- | ------- | ----- |
| AuthGuard |❌|✅|✅|✅|❌|
| SignIn |✅|✅|✅|✅|`passwordReset`|
| SignUp |✅|✅|✅|✅|❌|
| ConfirmSignUp |✅|✅|✅|✅|❌|
| ResetPassword |✅|✅|✅|✅|❌|
| ChangePassword |✅|✅|✅|✅|❌|
| ForgotPassword\* |✅|✅|✅|✅|❌|
| SignOut |✅|✅|✅|✅|❌|

> \* ForgotPassword has duplicated events as it handles both the new password request and confirmation.
> This events are prefixed with `request` and `confirm`, respectively.
> E.g.: `requestSuccess` and `confirmSuccess`.

## Available methods (@ `authStore`)

| Method                 | Usage                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| signUp                 | `$authStore.signUp(username: string, password: string, attributes?: ICognitoUserAttributeData[]))` |
| confirmSignUp          | `$authStore.confirmSignUp(username: string, confirmationCode: string)`                             |
| resendConfirmationCode | `$authStore.resendConfirmationCode(username: string)`                                              |
| signIn                 | `$authStore.signIn(username: string, password: string)`                                            |
| passwordResetChallenge | `$authStore.passwordResetChallenge(username: string, oldPassword: string, newPassword: string)`    |
| signOut                | `$authStore.signOut(global = false)`                                                               |
| getAttributes          | `$authStore.getAttributes()`                                                                       |
| updateAttributes       | `$authStore.updateAttributes(attributes: ICognitoUserAttributeData[])`                             |
| changePassword         | `$authStore.changePassword(oldPassword: string, newPassword: string)`                              |
| forgotPassword         | `$authStore.forgotPassword(username: string)`                                                      |
| confirmPassword        | `$authStore.confirmPassword(username: string, code: string, newPassword: string)`                  |
| deleteUser             | `$authStore.deleteUser()`                                                                          |

## Notes

This library aims to keep things simple and provide functionality over all things.

It might provide some minimal styles using TailwindCSS classes to streamline its implementation into your application.
