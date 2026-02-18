import { create } from "zustand";
import { isUnauthorized } from "../../api/httpError";
import * as authApi from "./api";
import type { AuthStoreState } from "./types";

type AuthStore = AuthStoreState;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshUser: async () => {
    set({ isLoading: true });
    try {
      const data = await authApi.me();
      set({ user: data, isAuthenticated: true });
    } catch (error) {
      if (isUnauthorized(error)) {
        set({ user: null, isAuthenticated: false });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },
  setUnauthenticated: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
