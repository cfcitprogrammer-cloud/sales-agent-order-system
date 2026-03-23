import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCartStore, type CartItem } from "@/stores/cart-store";

interface CheckoutItemCardProps {
  item: CartItem;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}

export default function CheckoutItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CheckoutItemCardProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const [open, setOpen] = useState(false);

  const handleIncrease = onIncrease
    ? onIncrease
    : () => increaseQuantity(item.cart_id);
  const handleDecrease = onDecrease
    ? onDecrease
    : () => decreaseQuantity(item.cart_id);
  const handleRemove = onRemove ? onRemove : () => removeFromCart(item.cart_id);

  return (
    <Card className="p-1">
      <CardContent className="p-1 text-sm">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-start cursor-pointer gap-2"
        >
          <figure className="w-12 h-12 overflow-hidden rounded-lg">
            <img
              src={item.product_img || ""}
              alt={item.product_name}
              className="w-full h-full object-cover object-center text-xs"
            />
          </figure>

          <div>
            <h1 className="text-xs font-semibold">{item.product_name}</h1>
            <p className="text-xs">{item.variant_alias}</p>

            {/* <p>P{item.price || 0}</p> */}
          </div>

          <div
            className="flex items-center justify-center gap-1 ml-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
              onClick={handleDecrease}
            >
              <Minus />
            </Button>
            <p>{item.cart_qty}</p>
            <Button
              type="button"
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
              onClick={handleIncrease}
            >
              <Plus />
            </Button>
            <Button
              type="button"
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
              onClick={handleRemove}
            >
              <X />
            </Button>
          </div>
        </div>

        {/* {open && (
          <div className="mt-2">
            <Table className="text-center">
              <TableHeader>
                <TableHead className="text-center">Item Rate</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>₱{item.price}</TableCell>
                  <TableCell>{item.cart_qty}</TableCell>
                  <TableCell>₱{item.price * item.cart_qty}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
