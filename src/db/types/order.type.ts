import type { OrderProducts } from "./order_products.type";

export type Order = {
  id: number;
  customer_name: string;
  contact_number: string | null;
  email: string | null;
  address: string;
  city: string | null;
  province: string | null;
  coor: string | null;
  delivery_date: string | null;
  notes: string | null;
  status: string;

  // Add order_products
  order_products?: OrderProducts[];
};
