import type { ProductVariant } from "./product_variant.type";

export type Product = {
  id: number;
  img_src: string | null;
  name: string;
  description: string | null;
  product_variant?: ProductVariant[];
  category: string | null;
  created_at: string;
};
