import { CognitoUserSession } from 'amazon-cognito-identity-js';
export type SignInResponse = SignInSession | PasswordChallenge;
export type SignInSession = {
	type: 'session';
	session: CognitoUserSession;
	needsConfirmation: boolean;
};
export type PasswordChallenge = {
	type: 'passwordChallenge';
	userAttributes: {
		[key: string]: string;
	};
	requiredAttributes: unknown[];
};
