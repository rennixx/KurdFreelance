import { create, type StateCreator } from "zustand";
import { persist, type PersistOptions } from "zustand/middleware";
import type { Tables } from "@/lib/supabase/types";
import {
  type UserRole,
  type Permission,
  hasPermission,
  canAccessRoute,
} from "@/lib/permissions";

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
  refreshUser: () => Promise<void>;
  // Permission helpers
  getUserRole: () => UserRole | null;
  hasPermission: (permission: Permission) => boolean;
  canAccessRoute: (path: string) => boolean;
}

type PersistedAuthState = Pick<AuthState, "user" | "isAuthenticated">;

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState, PersistedAuthState>
) => StateCreator<AuthState>;

export const useAuthStore = create<AuthState>(
  (persist as AuthPersist)(
    (set, get) => ({
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
      refreshUser: async () => {
        console.log("[AUTH STORE] Starting refreshUser...");
        console.log("[AUTH STORE] Current user:", get().user);
        console.log("[AUTH STORE] Current role:", get().getUserRole());
        
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log("[AUTH STORE] Auth user:", authUser);
        console.log("[AUTH STORE] Auth error:", authError);
        
        if (!authUser) {
          console.log("[AUTH STORE] No auth user, logging out");
          get().logout();
          return;
        }

        // Fetch fresh user data from database
        console.log("[AUTH STORE] Fetching user data from database for ID:", authUser.id);
        const { data: userData, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        console.log("[AUTH STORE] Database user data:", userData);
        console.log("[AUTH STORE] Database error:", dbError);

        if (userData) {
          console.log("[AUTH STORE] Setting new user with role:", userData.role);
          set({ user: userData, isAuthenticated: true });
          console.log("[AUTH STORE] User updated. New role:", get().getUserRole());
        } else {
          console.error("[AUTH STORE] Failed to fetch user data");
        }
      },
      // Permission helpers
      getUserRole: () => {
        const state = get();
        return state.user?.role ?? null;
      },
      hasPermission: (permission: Permission) => {
        const role = get().getUserRole();
        if (!role) return false;
        return hasPermission(role, permission);
      },
      canAccessRoute: (path: string) => {
        const role = get().getUserRole();
        if (!role) return false;
        return canAccessRoute(role, path);
      },
    }),
    {
      name: "auth-storage",
      partialize: (state): PersistedAuthState => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
