"use client";

import { Button } from "@/components/ui/button";
import { type CartItem, useCartStore } from "@/stores/cart-store";

interface OrderConfirmationProps {
  customer: { name: string; phone: string; address: string };
  onClose: () => void;
}

export default function OrderConfirmation({
  customer,
  onClose,
}: OrderConfirmationProps) {
  const { cart, totalPrice, clearCart } = useCartStore();

  const handlePlaceOrder = () => {
    // send order to backend here
    console.log("Order placed:", { customer, cart, total: totalPrice() });
    clearCart();
    onClose();
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] px-4 py-2">
      <h2 className="text-lg font-semibold">Order Confirmation</h2>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium">Customer Info</h3>
        <p>Name: {customer.name}</p>
        <p>Phone: {customer.phone}</p>
        <p>Address: {customer.address}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium">Cart Summary</h3>
        {cart.map((item: CartItem) => (
          <p key={item.cart_id}>
            {item.product_name} x {item.cart_qty} = ₱
            {item.cart_qty * item.price}
          </p>
        ))}
        {/* <p className="font-semibold">Total: ₱{totalPrice()}</p> */}
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
