// utils/mapToOrder.ts
import type { Order } from "@/db/types/order.type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCartId(): string {
  const now = new Date();

  // MMDDYY
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const yy = String(now.getFullYear()).slice(-2);

  // HHMMSS
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateTime = `${mm}${dd}${yy}${hh}${min}${ss}`;

  return `#${dateTime}`;
}

export function formatDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(",", "");
}

export function stringToColor(str: string) {
  // Hash string to a number
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = ((hash % 360) + str.length * 13) % 360;
  return `hsl(${h}, 50%, 45%)`; // pastel: lower saturation, high lightness
}

export function mapToOrder(data: any, orderId: number): Order {
  return {
    id: orderId,
    bp_code: data.bpCode ?? null,
    customer_name: data.customerName,
    delivery_date: data.deliveryDate ?? null,
    status: "Pending",

    order_products: (data.cart || []).map((item: any) => ({
      id: 0,
      product_name: item.product_name,
      variant_name: item.variant_name,
      sku: item.sku,
      uom: item.uom,
      price_at_order: item.price,
      qty: item.cart_qty,
      img_src: item.product_img ?? null,
    })),

    // optional fields
    city: data.city ?? null,
    street: data.street ?? null,
    notes: data.notes ?? null,
    attachments: data.attachments ?? [],

    // timestamps
    pending_at: null,
    reviewed_at: null,
    approved_at: null,
    rejected_at: null,
    cancelled_at: null,
    completed_at: null,

    created_at: "",
  };
}
