import type { Order } from "@/db/types/order.type";

const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbypev9DuJGFCQfiaWmA4RJeKVF62lpeV-uf251MgTaBUxSZYEOOveVCwcOu9QfP7r59/exec";

export function notifyViaEmail(order: Order, action: string) {
  const data = JSON.stringify({
    order_id: order.id,
    customer_name: order.customer_name,
    delivery_date: order.delivery_date,
    order_products: order.order_products,
    status: order.status,

    action,
  });

  navigator.sendBeacon(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, data);
}
