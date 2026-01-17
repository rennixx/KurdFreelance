import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tables } from "@/lib/supabase/types";

type User = Tables<"users">;
type FreelancerProfile = Tables<"freelancer_profiles">;
type ClientProfile = Tables<"client_profiles">;

interface AuthState {
  user: User | null;
  freelancerProfile: FreelancerProfile | null;
  clientProfile: ClientProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setFreelancerProfile: (profile: FreelancerProfile | null) => void;
  setClientProfile: (profile: ClientProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      freelancerProfile: null,
      clientProfile: null,
      isLoading: true,
      isAuthenticated: false,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),
      setFreelancerProfile: (profile) => set({ freelancerProfile: profile }),
      setClientProfile: (profile) => set({ clientProfile: profile }),
      setLoading: (loading) => set({ isLoading: loading }),
      logout: () =>
        set({
          user: null,
          freelancerProfile: null,
          clientProfile: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
