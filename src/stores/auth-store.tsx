import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: string | null;
  loading: boolean;

  // actions
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    email: string;
    password: string;
    name: string;
    role?: string; // optional role during registration
  }) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize local session
  supabase.auth.getSession().then(({ data }) => {
    const userRole = data.session?.user?.app_metadata?.role ?? null;
    set({
      session: data.session,
      user: data.session?.user ?? null,
      role: userRole,
      loading: false,
    });
  });

  // Listen for auth state changes globally
  supabase.auth.onAuthStateChange((_event, session) => {
    const userRole = session?.user?.app_metadata?.role ?? null;
    set({ session, user: session?.user ?? null, role: userRole });
  });

  return {
    session: null,
    user: null,
    role: null,
    loading: true,

    setSession: (session) =>
      set({
        session,
        user: session?.user ?? null,
        role: session?.user?.app_metadata?.role ?? null,
      }),

    signIn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({
        session: data.session,
        user: data.session?.user ?? null,
        role: data.session?.user?.app_metadata?.role ?? null,
      });
    },

    register: async ({ email, password, name, role }) => {
      // Supabase Auth Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: role ?? "user", // default role if not provided
          },
        },
      });
      if (error) throw error;
      set({
        session: data.session,
        user: data.session?.user ?? null,
        role: data.session?.user?.app_metadata?.role ?? role ?? "user",
      });
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null, role: null });
    },
  };
});
