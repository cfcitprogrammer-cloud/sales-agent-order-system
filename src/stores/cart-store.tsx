import { create } from "zustand";
import type { Product } from "@/db/types/product.type";
import type { ProductVariant } from "@/db/types/product_variant.type";
import { generateCartId } from "@/lib/utils";
import { toast } from "sonner";

export interface CartItem {
  cart_id: string;
  cart_qty: number;

  product_id: number;
  product_name: string;
  product_img: string | null;

  variant_id: number;
  variant_name: string;
  variant_alias: string;
  price: number;
  sku: string;
  uom: string;
}

interface CartState {
  cart: CartItem[];

  addToCart: (product: Product, variant: ProductVariant, qty?: number) => void; // <-- qty optional
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;

  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;

  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product, variant, qty = 1) => {
    const cart = get().cart;

    const existing = cart.find((item) => item.variant_id === variant.id);

    if (existing) {
      set({
        cart: cart.map((item) =>
          item.variant_id === variant.id
            ? { ...item, cart_qty: item.cart_qty + qty } // <-- add qty
            : item,
        ),
      });

      toast.success(
        `Added ${existing.cart_qty} ${existing.uom} of ${existing.product_name} - ${existing.variant_alias} to cart`,
      );
      return;
    }

    const newItem: CartItem = {
      cart_id: generateCartId(),
      cart_qty: qty, // <-- use qty here

      product_id: product.id,
      product_name: product.name,
      product_img: product.img_src,

      variant_id: variant.id,
      variant_name: variant.name,
      variant_alias: variant.alias,
      price: variant.price || 0,
      sku: variant.sku,
      uom: variant.uom,
    };

    set({
      cart: [...cart, newItem],
    });

    toast.success(
      `Added ${newItem.cart_qty} ${newItem.uom} of ${newItem.product_name} - ${newItem.variant_alias} to cart`,
    );
  },

  removeFromCart: (cartId) => {
    set({
      cart: get().cart.filter((item) => item.cart_id !== cartId),
    });
  },

  clearCart: () => set({ cart: [] }),

  increaseQuantity: (cartId) => {
    set({
      cart: get().cart.map((item) =>
        item.cart_id === cartId
          ? { ...item, cart_qty: item.cart_qty + 1 }
          : item,
      ),
    });
  },

  decreaseQuantity: (cartId) => {
    set({
      cart: get()
        .cart.map((item) =>
          item.cart_id === cartId
            ? { ...item, cart_qty: item.cart_qty - 1 }
            : item,
        )
        .filter((item) => item.cart_qty > 0),
    });
  },

  totalPrice: () =>
    get().cart.reduce((sum, item) => sum + item.price * item.cart_qty, 0),
}));
