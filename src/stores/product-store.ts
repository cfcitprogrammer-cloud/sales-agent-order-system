import { create } from "zustand";
import type { Product } from "@/db/types/product";
import { supabase } from "@/lib/supabase"; // make sure you have supabase client setup
import { toast } from "sonner";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  getProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),

  getProducts: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error: err } = await supabase.from("products").select("*");

      if (err) {
        set({
          error: err.message || "Failed to fetch products",
          loading: false,
        });

        toast.error(err.message || "Failed to fetch products");
      }

      set({ products: data || [], loading: false });
    } catch (err: any) {
      set({ error: err || "Failed to fetch products", loading: false });

      toast.error(err || "Failed to fetch products");
    }
  },
}));
