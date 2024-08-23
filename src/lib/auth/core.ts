import {
	CognitoUserPool,
	CognitoUserAttribute,
	CognitoUser,
	AuthenticationDetails
} from 'amazon-cognito-identity-js';
import type { CognitoUserSession, ICognitoUserAttributeData } from 'amazon-cognito-identity-js';

import type { SignInResponse, SignInSession } from '@types';

export class Auth {
	// Private fields
	#UserPool: CognitoUserPool;
	#CognitoUser?: CognitoUser;

	constructor(UserPoolId: string, ClientId: string) {
		this.#UserPool = new CognitoUserPool({
			UserPoolId,
			ClientId
		});
	}

	// Auth operations
	signUp(username: string, password: string, attributes: ICognitoUserAttributeData[] = []) {
		const userAttributes = attributes.map((attr) => new CognitoUserAttribute(attr));

		const promise = new Promise((resolve, reject) => {
			this.#UserPool.signUp(username, password, userAttributes, [], (err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the sign up request"));
			});
		});

		return promise;
	}

	confirmSignUp(username: string, confirmationCode: string) {
		const userData = { Username: username, Pool: this.#UserPool };
		const cognitoUser = new CognitoUser(userData);
		const promise = new Promise((resolve, reject) => {
			cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the confirm registration request"));
			});
		});

		return promise;
	}

	resendConfirmationCode(username: string) {
		const userData = { Username: username, Pool: this.#UserPool };
		const cognitoUser = new CognitoUser(userData);
		const promise = new Promise((resolve, reject) => {
			cognitoUser.resendConfirmationCode((err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the resend confirmation code request"));
			});
		});

		return promise;
	}

	async signIn(username: string, password: string): Promise<SignInResponse> {
		const authenticationDetails = new AuthenticationDetails({
			Username: username,
			Password: password
		});

		const userData = {
			Username: username,
			Pool: this.#UserPool
		};

		const cognitoUser = new CognitoUser(userData);

		const promise = new Promise<SignInResponse>((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (session: CognitoUserSession, userConfirmationNecessary?: boolean) => {
					this.#CognitoUser = cognitoUser;
					const needsConfirmation = !!userConfirmationNecessary;
					const value: SignInSession = {
						type: 'session',
						session,
						needsConfirmation
					};
					return resolve(value);
				},
				onFailure: (err: Error) => {
					return reject(err);
				},
				newPasswordRequired: (/* userAttributes: { [key: string]: string } */) => {
					return reject(new Error('newPasswordRequired'));
				}
			});
		});

		return promise;
	}

	passwordResetChallenge(username: string, oldPassword: string, newPassword: string) {
		const authenticationDetails = new AuthenticationDetails({
			Username: username,
			Password: oldPassword
		});

		const userData = {
			Username: username,
			Pool: this.#UserPool
		};

		const cognitoUser = new CognitoUser(userData);

		const promise = new Promise<SignInResponse>((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: (session: CognitoUserSession, userConfirmationNecessary?: boolean) => {
					this.#CognitoUser = cognitoUser;
					const needsConfirmation = !!userConfirmationNecessary;
					const value: SignInSession = {
						type: 'session',
						session,
						needsConfirmation
					};
					return resolve(value);
				},
				onFailure: (err: Error) => {
					return reject(err);
				},
				newPasswordRequired: (userAttributes: { [key: string]: string }) => {
					// User was signed up by an admin and must provide new
					// password and required attributes, if any, to complete
					// authentication.

					// The api doesn't accept this field back
					delete userAttributes.email;
					delete userAttributes.email_verified;

					cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
						onSuccess: (session, userConfirmationNecessary) => {
							return resolve({
								type: 'session',
								session,
								needsConfirmation: !!userConfirmationNecessary
							});
						},
						onFailure: (err: Error) => {
							return reject(err);
						}
					});
					return reject(new Error('newPasswordRequired'));
				}
			});
		});

		return promise;
	}

	/*  /**
     * Used when users are created via AdminAPI.
     * @param newPassword
     * @param sessionUserAttributes
     * @returns User session or an Error
     *
    async handlePasswordChallenge(
        username: string,
        newPassword: string,
        sessionUserAttributes: unknown
    ): Promise<SignInResponse | Error> {
        const userData = {
            Username: username,
            Pool: this.#UserPool,
        };
        const cognitoUser = new CognitoUser(userData);

        const promise = new Promise<SignInResponse | Error>(
            (resolve, reject) => {
                cognitoUser.completeNewPasswordChallenge(
                    newPassword,
                    sessionUserAttributes,
                    {
                        onSuccess: (session, userConfirmationNecessary) => {
                            console.log('success');
                            return resolve({
                                type: 'session',
                                session,
                                needsConfirmation: !!userConfirmationNecessary,
                            });
                        },
                        onFailure: (err: Error) => {
                            console.log('fail');
                            return reject(err);
                        },
                    }
                );
            }
        );
        return promise;
    } */

	/**
	 * Signs user from application. If global, invalidates all issued tokens.
	 * @param global
	 * @returns promise with error or string of success.
	 */
	async signOut(global = false) {
		if (!this.#CognitoUser) {
			const cognitoUser = await this.#retrieveLocalSession();
			if (cognitoUser instanceof Error) throw cognitoUser;
			else this.#CognitoUser = cognitoUser;
		}

		const promise = new Promise<string>((resolve, reject) => {
			if (!this.#CognitoUser) {
				return reject('no user session found');
			}
			if (global) {
				this.#CognitoUser.globalSignOut({
					onSuccess: (msg) => resolve(msg),
					onFailure: (err) => reject(err)
				});
			} else {
				this.#CognitoUser.signOut(() => resolve('SUCCESS'));
			}
		});
		return promise;
	}

	// User data

	/**
	 * If user is authenticated, tries to get its attributes by returning a promise.
	 * @returns A promise with error or attributes if authenticated.
	 */
	async getAttributes() {
		if (!this.#CognitoUser) {
			const cognitoUser = await this.#retrieveLocalSession();
			if (cognitoUser instanceof Error) throw cognitoUser;
			else this.#CognitoUser = cognitoUser;
		}
		const promise = new Promise<CognitoUserAttribute[]>((resolve, reject) => {
			if (!this.#CognitoUser) {
				return reject('no user session found');
			}
			this.#CognitoUser.getUserAttributes((err, attributes) => {
				if (err) return reject(err);
				else if (attributes) return resolve(attributes);
				else return reject(new Error("couldn't resolve the get user attributes request"));
			});
		});
		return promise;
	}

	async updateAttributes(attributes: ICognitoUserAttributeData[]) {
		if (!this.#CognitoUser) {
			const cognitoUser = await this.#retrieveLocalSession();
			if (cognitoUser instanceof Error) throw cognitoUser;
			else this.#CognitoUser = cognitoUser;
		}
		const promise = new Promise<string>((resolve, reject) => {
			if (!this.#CognitoUser) {
				return reject('no user session found');
			}
			const userAttributes = attributes.map((attr) => new CognitoUserAttribute(attr));
			this.#CognitoUser.updateAttributes(userAttributes, (err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the update user attributes request"));
			});
		});
		return promise;
	}

	async changePassword(oldPassword: string, newPassword: string) {
		if (!this.#CognitoUser) {
			const cognitoUser = await this.#retrieveLocalSession();
			if (cognitoUser instanceof Error) throw cognitoUser;
			else this.#CognitoUser = cognitoUser;
		}
		const promise = new Promise<'SUCCESS'>((resolve, reject) => {
			if (!this.#CognitoUser) {
				return reject('no user session found');
			}
			this.#CognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the change user password request"));
			});
		});
		return promise;
	}

	async deleteUser() {
		if (!this.#CognitoUser) {
			const cognitoUser = await this.#retrieveLocalSession();
			if (cognitoUser instanceof Error) throw cognitoUser;
			else this.#CognitoUser = cognitoUser;
		}
		const promise = new Promise<string>((resolve, reject) => {
			if (!this.#CognitoUser) {
				return reject('no user session found');
			}
			this.#CognitoUser.deleteUser((err, result) => {
				if (err) return reject(err);
				else if (result) return resolve(result);
				else return reject(new Error("couldn't resolve the change user password request"));
			});
		});
		return promise;
	}

	// Private methods
	/**
	 * Tries to retrieve user session either by remembering it, getting it from local storage, or by refreshing the session.
	 * @returns promise holding true if found valid session, error otherwise.
	 */
	async #retrieveLocalSession() {
		const promise = new Promise<CognitoUser>((resolve, reject) => {
			// If already has session, return.
			if (this.#CognitoUser) return resolve(this.#CognitoUser);

			// If session wasn't found, retrieve from local storage.
			const cognitoUser = this.#UserPool.getCurrentUser();
			if (cognitoUser) {
				this.#CognitoUser = cognitoUser;

				this.#CognitoUser.getSession((err: null, session: CognitoUserSession | null) => {
					if (err) return reject(err);
					else if (session) {
						if (session.isValid()) return resolve(cognitoUser);
						else {
							this.#CognitoUser?.refreshSession(
								session.getRefreshToken(),
								(err: null, session: CognitoUserSession | null) => {
									if (err) return reject(err);
									else if (session) return resolve(cognitoUser);
									else
										return reject(new Error("couldn't resolve the refresh user session request"));
								}
							);
						}
					} else return reject(new Error('session is not valid'));
				});
			}

			// If couldn't retrieve session, return error
			return reject(new Error('no user session found'));
		});
		return await promise;
	}
}
