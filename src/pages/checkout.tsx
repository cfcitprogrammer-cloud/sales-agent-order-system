import { CheckoutForm } from "@/components/forms/checkout-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import type { CheckoutFormValues } from "@/db/schema/checkout.schema";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useCartStore } from "@/stores/cart-store";
import { useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const { clearCart } = useCartStore();

  async function handleOrderSubmit(values: CheckoutFormValues) {
    const t = toast.loading("Your order is being created...");

    try {
      const { error } = await supabase.rpc("create_order_with_items", {
        order_data: {
          store_name: values.storeName,
          customer_name: values.customerName,
          contact_person: values.contactPerson,
          address: values.address,
          status: "PENDING",
          delivery_date: values.deliveryDate,
          receiving_time: values.receivingTime,
          remarks: values.notes,
          user_id: user?.id,
          city: values.city,
          province: values.province,
        },
        items_data: values.cart.map((item) => ({
          cart_id: item.cart_id,
          item: item.product_name,
          unit: item.unit,
          weight_value: item.weight_value,
          weight_unit: item.weight_unit,
          price: item.price,
          base_price: item.base_price,
          qty: item.qty,
          cart_qty: item.cart_qty,
        })),
      });

      if (error) {
        toast.error(error.message);
        return false;
      } else {
        toast.dismiss(t);
        toast.success("Order created");
        clearCart();
        return true;
      }
    } catch (error: any) {
      if (error?.message) {
        toast.error(error?.message);
      }

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
