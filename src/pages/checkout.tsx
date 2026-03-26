"use client";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { Separator } from "@/components/ui/separator";
import type { CheckoutFormValues } from "@/db/schema/checkout.schema";
import { notifyViaEmail } from "@/lib/email-notifier";
import { supabase } from "@/lib/supabase";
import { mapToOrder } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { cart, clearCart } = useCartStore();

  // Handles form submission and sends order + items to Supabase
  async function handleOrderSubmit(values: CheckoutFormValues) {
    console.log("HEY");
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    const t = toast.loading("Your order is being created...");

    try {
      // Call the RPC we created
      const { error, data: newOrderId } = await supabase.rpc(
        "create_order_with_items",
        {
          order_data: {
            customer_name: values.customerName,
            bp_code: values.bpCode ?? null,
            street: values.street ?? null,
            city: values.city ?? null,
            delivery_date:
              values.deliveryDate &&
              !isNaN(new Date(values.deliveryDate).getTime())
                ? new Date(values.deliveryDate).toISOString().split("T")[0]
                : null,
            notes: values.notes ?? null,
            attachments: values.attachments ?? null,
            status: "Pending",
            user_id: user?.id ?? null, // optional
          },
          items_data: cart.map((item) => ({
            product_name: item.product_name,
            variant_name: item.variant_name,
            sku: item.sku,
            uom: item.uom,
            price_at_order: item.price || 0,
            qty: item.cart_qty,
            img_src: item.product_img ?? null,
          })),
        },
      );

      if (error) {
        toast.dismiss(t);
        toast.error(error.message);
        return false;
      }

      const newOrder = mapToOrder(values, newOrderId);
      notifyViaEmail(newOrder, "logistics");
      toast.dismiss(t);
      toast.success("Order created successfully");
      clearCart();
      return true;
    } catch (err: any) {
      toast.dismiss(t);
      toast.error(err?.message || "Failed to create order");
      return false;
    }
  }

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-4">
      <header>
        <h1 className="font-semibold text-2xl">Checkout</h1>
        <p className="text-sm">
          Enter customer information and confirm your order.
        </p>
      </header>

      <Separator />

      <CheckoutForm onSubmit={handleOrderSubmit} />
    </section>
  );
}
