import { create } from 'zustand';
import { User, AuthState } from '@/types/auth';
import { SecureStorageService } from '@/utils/storage';

export interface AuthStore extends AuthState {
  signIn: (token: string, refreshToken: string | null, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  isLoading: true,

  initialize: async () => {
    try {
      const storedToken = await SecureStorageService.getItem('authToken');
      const storedRefreshToken = await SecureStorageService.getItem('refreshToken');
      const storedUser = await SecureStorageService.getItem('authUser');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        set({
          isAuthenticated: true,
          user: parsedUser,
          token: storedToken,
          refreshToken: storedRefreshToken,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth store initialization error:', error);
      set({ isLoading: false });
    }
  },

  signIn: async (token: string, refreshToken: string | null, userData: User) => {
    try {
      await SecureStorageService.setItem('authToken', token);
      if (refreshToken) {
        await SecureStorageService.setItem('refreshToken', refreshToken);
      } else {
        await SecureStorageService.removeItem('refreshToken');
      }
      await SecureStorageService.setItem('authUser', JSON.stringify(userData));

      set({
        isAuthenticated: true,
        user: userData,
        token,
        refreshToken,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign-in persistence failed:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await SecureStorageService.removeItem('authToken');
      await SecureStorageService.removeItem('refreshToken');
      await SecureStorageService.removeItem('authUser');

      set({
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    set({ user: updatedUser });

    try {
      await SecureStorageService.setItem('authUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to persist updated user info:', error);
    }
  },
}));
