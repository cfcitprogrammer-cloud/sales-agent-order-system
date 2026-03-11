export type OrderProducts = {
  id: number;
  order_id: number;
  img_src: string | null;
  product_name: string;
  variant_name: string;
  sku: string;
  uom: string;
  price_at_order: number;
  qty: number;
};
