import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import type { Product } from "@/db/types/product";
import { useCartStore } from "@/stores/cart-store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } =
    useCartStore();
  const cartItem = cart.find((item) => item.id === product.id);

  const quantity = cartItem?.cart_qty || 0;

  const handleIncrement = () => {
    if (cartItem) {
      increaseQuantity(cartItem.cart_id);
    } else {
      addToCart(product);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      decreaseQuantity(cartItem.cart_id);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-2">
        <figure className="overflow-hidden rounded-lg h-48 w-full flex items-center justify-center bg-gray-100">
          <img
            src={product.img_src || ""}
            alt={product.product_name}
            className="max-h-full max-w-full object-contain"
          />
        </figure>
        <h2 className="font-semibold text-xs">{product.product_name}</h2>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-1">
        <p>₱{product.price}</p>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="rounded-full"
            size={"icon-sm"}
            onClick={handleDecrement}
          >
            <Minus />
          </Button>
          <p>{quantity}</p>
          <Button
            variant="ghost"
            className="rounded-full"
            size={"icon-sm"}
            onClick={handleIncrement}
          >
            <Plus />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
