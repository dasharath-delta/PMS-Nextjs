import { create } from 'zustand';
import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';

export const useUserStore = create(set => ({
  user: null,
  isLoading: false,
  error: null,

  registerUser: async userData => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      set({ user: data.user, isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  loginUser: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        set({ error: result.error, isLoading: false });
        return null;
      }

      // fetch session user after login
      const sessionRes = await axios.get('/api/auth/session');
      set({ user: sessionRes.data?.user, isLoading: false });
      return sessionRes.data?.user;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      throw err;
    }
  },

  logoutUser: async () => {
    set({ isLoading: true });
    try {
      await signOut({ redirect: false });
      set({ user: null, isLoading: false });
    } catch (err) {
      set({ error: 'Logout failed', isLoading: false });
    }
  },

  setUser: user => set({ user }),
}));
