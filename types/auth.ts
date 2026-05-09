/**
 * Representation of a User profile in the application.
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt: string;
}

/**
 * Representation of a user session token set.
 */
export interface Session {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number; // Epoch timestamp
}

/**
 * Authentication state of the application.
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
