import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { UserProfile } from "@/schemas/user";

type AuthUser = UserProfile;

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Persisted to localStorage so a page refresh doesn't force a re-login.
// Only tokens/user are persisted -- nothing sensitive beyond what a
// JWT already is, and access tokens are short-lived by design.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setAccessToken: (accessToken) => set({ accessToken }),

      setUser: (user) => set({ user }),

      logout: () => set({ accessToken: null, refreshToken: null, user: null }),

      isAuthenticated: () => get().accessToken !== null,
    }),
    { name: "agatu-auth" },
  ),
);
