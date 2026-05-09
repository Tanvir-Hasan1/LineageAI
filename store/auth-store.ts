import { create } from 'zustand';
import { User, AuthState } from '@/types/auth';
import { SecureStorageService } from '@/utils/storage';

export interface AuthStore extends AuthState {
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,

  initialize: async () => {
    try {
      const storedToken = await SecureStorageService.getItem('authToken');
      const storedUser = await SecureStorageService.getItem('authUser');

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser) as User;
        set({
          isAuthenticated: true,
          user: parsedUser,
          token: storedToken,
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

  signIn: async (token: string, userData: User) => {
    try {
      await SecureStorageService.setItem('authToken', token);
      await SecureStorageService.setItem('authUser', JSON.stringify(userData));

      set({
        isAuthenticated: true,
        user: userData,
        token,
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
      await SecureStorageService.removeItem('authUser');

      set({
        isAuthenticated: false,
        user: null,
        token: null,
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
