/**
 * Auth Module
 * Handles authentication (login/register) and role selection
 */

export { AuthProvider, useAuth } from './auth.context';
export type { User } from './auth.context';
export { Login, Register, AuthScreen } from './components/index';

