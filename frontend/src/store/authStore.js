import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";


const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  stableId: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, formData);
      const user = response.data.user || null;
      const stable = response.data.stable || null;

      set({
        user,
        stableId: stable?._id || null,
        isAuthenticated: true,
        isLoading: false,
      });

      return response;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Signup failed. Try again.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        userEmail: email,
        password,
      });

      const user = response.data.user || null;
      const stable = response.data.stable || null;

      // const token = response.data.token;
      // localStorage.setItem("token", token);


      set({
        user,
        stableId: stable?._id || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        stableId: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Logout failed", isLoading: false });
      toast.error("Logout failed");
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      
      const user = response.data.user || null;
      const stable = response.data.stable || null;
      console.log("✅ checkAuth success:", response.data);

      set({
        user:stable,
        stableId: stable?._id || null,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      console.error("checkAuth failed:", error);
      set({
        error:
          error?.response?.data?.message || "Auth check failed",
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  verifyEmail: async (code) => {
    try {
      const response = await axios.post('/api/auth/verify-email', { code });
  
      // Log user object for debugging
      console.log('✅ Verified user object:', response.data.user);
  
      set({
        user: response.data.user,
        isAuthenticated: true,
        error: null,
      });
  
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
  
      return response.data;
    } catch (error) {
      console.error('❌ Verification failed:', error.response?.data || error.message);
      set({ error: error.response?.data?.message || 'Verification failed' });
      throw error;
    }
  },


  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error sending reset password email";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
      toast.success(response.data.message);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error resetting password";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },
}));
