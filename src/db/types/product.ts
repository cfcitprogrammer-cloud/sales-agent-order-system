export type Product = {
  id: number;
  gdrive_id: string;
  img_src: string | null;
  product_name: string;
  unit: string;
  weight_value: number;
  weight_unit: string;
  price: number;
  created_at: string; // ISO date string
  info_id: number | null;
  base_price: number;
  qty: number;
};
