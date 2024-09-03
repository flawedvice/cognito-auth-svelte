// Apply tailwind styles to components
import './base.css';

import { initAuth, authStore } from './auth';
export { initAuth, authStore };

import {
	SignUp,
	SignIn,
	SignOut,
	ResetPassword,
	ChangePassword,
	ConfirmSignUp,
	AuthGuard
} from './components';
export { SignUp, SignIn, SignOut, ResetPassword, ChangePassword, ConfirmSignUp, AuthGuard };
