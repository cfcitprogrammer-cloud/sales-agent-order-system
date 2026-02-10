import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Minus, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import { useCartStore, type CartItem } from "@/stores/cart-store";

export default function CheckoutItemCard({ item }: { item: CartItem }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCartStore();
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-1">
      <CardContent className="p-1 text-sm">
        <div
          onClick={() => setOpen(!open)}
          className="flex justify-between items-center gap-1 cursor-pointer"
        >
          <div>
            <h1>{item.product_name}</h1>
            <p>
              {item.unit} | {item.cart_qty} pcs
            </p>
          </div>

          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
              onClick={() => decreaseQuantity(item.cart_id)}
            >
              <Minus />
            </Button>
            <p>{item.cart_qty}</p>
            <Button
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
              onClick={() => increaseQuantity(item.cart_id)}
            >
              <Plus />
            </Button>
          </div>
        </div>

        {open && (
          <div className="mt-2">
            <Table className="text-center">
              <TableHeader>
                <TableHead className="text-center">Item Rate</TableHead>
                <TableHead className="text-center">Amount</TableHead>
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
        )}
      </CardContent>
    </Card>
  );
}
