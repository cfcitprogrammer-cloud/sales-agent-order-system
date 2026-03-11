import { create } from "zustand";
import type { Order } from "@/db/types/order";
import { supabase } from "@/lib/supabase"; // make sure you have supabase client setup
import { toast } from "sonner";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  getOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  loading: false,
  error: null,

  setOrders: (orders) => set({ orders }),

  getOrders: async () => {
    set({ loading: true, error: null });

    try {
      const { data, error: err } = await supabase.from("orders").select("*");

      if (err) {
        set({
          error: err.message || "Failed to fetch orders",
          loading: false,
        });
        toast.error(err.message || "Failed to fetch orders");
        return;
      }

      set({ orders: data || [], loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch orders", loading: false });
      toast.error(err.message || "Failed to fetch orders");
    }
  },
}));
