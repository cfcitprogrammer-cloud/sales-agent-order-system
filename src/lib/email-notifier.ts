import type { Order } from "@/db/types/order.type";

const GOOGLE_APPS_SCRIPT_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbz6FZxCCAdIBFYe2OkfPMaT1l6W5BeGvvVbYPBs0eUXKJFCW_n1_Ti3TvfEvNdi7kDd/exec";

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

  console.log(data);
  console.log(GOOGLE_APPS_SCRIPT_WEBHOOK_URL);
  navigator.sendBeacon(GOOGLE_APPS_SCRIPT_WEBHOOK_URL, data);
}
