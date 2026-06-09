/**
 * Representation of a User profile in the application.
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isEmailVerified?: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
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
  refreshToken: string | null;
  isLoading: boolean;
}
