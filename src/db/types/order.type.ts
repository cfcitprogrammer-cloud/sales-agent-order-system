import type { OrderProducts } from "./order_products.type";

export type Order = {
  id: number;
  bp_code: string;
  customer_name: string;
  city: string | null;
  street: string | null;
  delivery_date: string | null;
  notes: string | null;
  status: string;
  created_at: string;

  // Add order_products
  order_products?: OrderProducts[];

  pending_at: string | null;
  cancelled_at: string | null;
  reviewed_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  completed_at: string | null;
};
