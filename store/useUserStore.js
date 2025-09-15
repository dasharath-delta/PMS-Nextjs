import { create } from 'zustand';
import axios from 'axios';
import { signIn, signOut } from 'next-auth/react';

export const useUserStore = create(set => ({
  user: null,
  profile: null, // <-- store profile separately
  isLoading: false,
  error: null,
  isEdit: false,
  allUsers: [],

  setIsEdit: value => set({ isEdit: value }),

  registerUser: async userData => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/register', userData);
      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      set({ user: data.data, isLoading: false });
      return data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      throw err;
    }
  },

  loginUser: async (email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      // call NextAuth signIn with role
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        role, // 👈 include role
      });

      if (result?.error) {
        set({ error: result.error, isLoading: false });
        return null; // login failed
      }

      // Fetch user session/me API to sync store
      const { data } = await axios.get('/api/auth/me');

      // check if role from backend matches selected role
      if (data?.data?.role !== role) {
        set({ error: 'Invalid role selected', isLoading: false });
        return null;
      }

      set({ user: data.data, isLoading: false });
      return data.data; // return user object
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      return null;
    }
  },

  logoutUser: async () => {
    set({ isLoading: true });
    try {
      await signOut({ callbackUrl: '/login' }); // 👈 destroys session + redirect
      set({ profile: null, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: 'Logout failed' });
    }
  },

  // ✅ Create new profile
  createProfile: async profileData => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/profile/add', profileData);
      if (!data.success) {
        throw new Error(data.message || 'Profile creation failed');
      }

      set({ profile: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Profile creation failed',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/profile/me');
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }
      set({ profile: data?.data, isLoading: false });
      return data?.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch profile',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/auth/allusers');
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      set({ allUsers: data?.data, isLoading: false });
      return data?.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch users',
        isLoading: false,
      });
      throw err;
    }
  },

  updateProfile: async profileData => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put('/api/profile/update', profileData);
      if (!data.success) {
        throw new Error(data.message || 'Profile update failed');
      }

      set({ profile: data.data, isLoading: false, isEdit: false });
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Profile update failed',
        isLoading: false,
      });
      throw err;
    }
  },

  updateUsername: async username => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put('/api/auth/username', { username });
      if (!data.success)
        throw new Error(data.message || 'Failed to update username');

      // Update user in store
      set(state => ({
        user: { ...state.user, username }, // update name key to reflect NextAuth session
        isLoading: false,
      }));

      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to update username',
        isLoading: false,
      });
      throw err;
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get('/api/auth/me');

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch user');
      }
      set({ user: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch user',
        isLoading: false,
      });
      set({ user: null });
      throw err;
    }
  },

  updateUserPassword: async (password, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.put('/api/auth/update-password', {
        password,
        newPassword,
      });
      console.log(data);

      if (!data.success) {
        throw new Error(data.message || 'Failed to updated password');
      }
      set({ isLoading: false });
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch user',
        isLoading: false,
      });
      set({ user: null });
      throw err;
    }
  },
  forgotPassword: async email => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/forgot-password', { email });
      if (!data.success) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      set({ isLoading: false });
      return data.message;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to send reset link',
        isLoading: false,
      });
      throw err;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
      if (!data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }
      set({ isLoading: false });
      return data.message;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to reset password',
        isLoading: false,
      });
      throw err;
    }
  },

  uploadAvatar: async file => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const { data } = await axios.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!data.success) {
        throw new Error(data.message || 'Avatar upload failed');
      }

      // update profile in state
      set({ profile: data.data, isLoading: false });
      return data.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Avatar upload failed',
        isLoading: false,
      });
      throw err;
    }
  },

  setUser: user => set({ user }),
}));
