import { writable } from 'svelte/store';
import { Auth } from './core';

export const authStore = writable<Auth>();

export function initAuth(UserPoolId: string, ClientId: string) {
	const auth = new Auth(UserPoolId, ClientId);
	authStore.set(auth);
}
