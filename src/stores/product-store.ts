import { create } from "zustand";
import type { Product } from "@/db/types/product.type";
import type { ProductVariant } from "@/db/types/product_variant.type";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  selectedVariant: ProductVariant | null;
  quantity: number;
  isAddToCartOpen: boolean;
  loading: boolean;
  error: string | null;

  setProducts: (products: Product[]) => void;
  getProducts: () => Promise<void>;

  setCurrentProduct: (product: Product | null) => void;
  clearCurrentProduct: () => void;

  setSelectedVariant: (variant: ProductVariant | null) => void;

  setQuantity: (qty: number) => void;
  increaseQuantity: () => void;
  decreaseQuantity: () => void;

  setAddToCartOpen: (isOpen: boolean) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  selectedVariant: null,
  quantity: 1,
  isAddToCartOpen: false,
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),

  setCurrentProduct: (product) =>
    set({
      currentProduct: product,
      quantity: 1,
      selectedVariant: product?.product_variant?.[0] ?? null, // <-- auto-select first variant
    }),

  clearCurrentProduct: () =>
    set({ currentProduct: null, selectedVariant: null, quantity: 1 }),

  setSelectedVariant: (variant) => set({ selectedVariant: variant }),

  setQuantity: (qty) => set({ quantity: qty < 1 ? 1 : qty }),

  increaseQuantity: () => set((state) => ({ quantity: state.quantity + 1 })),

  decreaseQuantity: () =>
    set((state) => ({
      quantity: state.quantity > 1 ? state.quantity - 1 : 1,
    })),

  setAddToCartOpen: (isOpen) => set({ isAddToCartOpen: isOpen }),

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

      set({ products: data || [], loading: false });
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
