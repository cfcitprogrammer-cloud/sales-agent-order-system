import { create } from "zustand";
import type { Product } from "@/db/types/product";
import { generateCartId } from "@/lib/utils";

export interface CartItem extends Product {
  cart_id: string; // unique id for this cart entry
  cart_qty: number; // renamed quantity
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  increaseQuantity: (cartId: string) => void;
  decreaseQuantity: (cartId: string) => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) => {
    const cart = get().cart;
    // check if product already in cart
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      set({
        cart: cart.map((item) =>
          item.cart_id === existing.cart_id
            ? { ...item, cart_qty: item.cart_qty + 1 }
            : item,
        ),
      });
    } else {
      set({
        cart: [...cart, { ...product, cart_qty: 1, cart_id: generateCartId() }],
      });
    }
  },

  removeFromCart: (cartId) => {
    set({ cart: get().cart.filter((item) => item.cart_id !== cartId) });
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
