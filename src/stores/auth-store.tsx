import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  // actions
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize local session
  supabase.auth.getSession().then(({ data }) => {
    set({
      session: data.session,
      user: data.session?.user ?? null,
      loading: false,
    });
  });

  // Listen for auth state changes globally
  supabase.auth.onAuthStateChange((_event, session) => {
    set({ session, user: session?.user ?? null });
  });

  return {
    session: null,
    user: null,
    loading: true,

    setSession: (session) => set({ session, user: session?.user ?? null }),

    signIn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ session: data.session, user: data.session?.user ?? null });
    },

    register: async ({ email, password, name }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      set({ session: data.session, user: data.session?.user ?? null });
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null, user: null });
    },
  };
});
