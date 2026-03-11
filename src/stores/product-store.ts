import { create } from "zustand";
import type { Product } from "@/db/types/product.type";
import { supabase } from "@/lib/supabase"; // make sure you have supabase client setup
import { toast } from "sonner";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isAddToCartOpen: boolean;
  loading: boolean;
  error: string | null;
  setProducts: (products: Product[]) => void;
  getProducts: () => Promise<void>;
  clearCurrentProduct: () => void;
  setCurrentProduct: (product: Product | null) => void;
  setAddToCartOpen: (isOpen: boolean) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  isAddToCartOpen: false,
  loading: false,
  error: null,

  clearCurrentProduct: () => set({ currentProduct: null }),

  setCurrentProduct: (product: Product | null) =>
    set({ currentProduct: product }),

  setAddToCartOpen: (isOpen: boolean) => set({ isAddToCartOpen: isOpen }),

  setProducts: (products) => set({ products }),

  getProducts: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error: err } = await supabase.from("products").select(`
        *,
        product_variant (
          id,
          name,
          alias,
          price,
          sku,
          uom
        )
      `);

      if (err) {
        console.error("Supabase error:", err);
        set({
          error: err.message || "Failed to fetch products",
          loading: false,
        });
        toast.error(err.message || "Failed to fetch products");
        return;
      }

      console.log(data);
      set({ products: data, loading: false });
    } catch (err: any) {
      console.error("Unexpected error:", err);
      set({
        error: err?.message || "Failed to fetch products",
        loading: false,
      });
      toast.error(err?.message || "Failed to fetch products");
    }
  },
}));
