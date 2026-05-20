import type { Order } from "@/db/types/order.type";

const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbwjdCY9ahMgCrsYM8KFjhvvd_vrqapi3G-V1soEH4X1LLiG0D3UPvVaTvlupQP3ykJl/exec";

export function notifyViaEmail(order: Order, action: string) {
  const data = JSON.stringify({
    order_id: order.id,
    customer_name: order.customer_name,
    delivery_date: order.delivery_date,
    order_products: order.order_products,
    status: order.status,
    order_by: order.order_by,

    action,
  });

  navigator.sendBeacon(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, data);
}
