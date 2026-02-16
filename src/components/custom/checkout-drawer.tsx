import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EyeOff, Printer, ShoppingBasket, X } from "lucide-react";
import CheckoutItemCard from "./checkout-item-card";
import { Separator } from "../ui/separator";
import { useCartStore } from "@/stores/cart-store";
import { formatDateTime, generateCartId } from "@/lib/utils";
import { Link } from "react-router-dom";
import CustomAlertDialog from "./dialogs/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function CheckoutDrawer() {
  const { cart, totalPrice, clearCart } = useCartStore();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full" size={"icon-sm"}>
          <ShoppingBasket />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between gap-1 flex-wrap">
          <DrawerTitle>Order {generateCartId()}</DrawerTitle>
          <DrawerDescription>{formatDateTime()}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-hidden w-full">
          <div>
            <div className="px-4">
              <div className="flex items-center justify-between gap-1 mb-2">
                <p className="text-sm font-semibold">Your Cart</p>

                <p className="text-xs">Total: {cart.length}</p>
              </div>

              <div className="no-scrollbar overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <CheckoutItemCard item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Separator />
          <div className="text-sm">
            <h2 className="font-semibold">Payment Summary</h2>
            <div className="flex justify-between items-center gap-1">
              <p className="text-gray-500">Sub Total</p>
              <p>₱{totalPrice()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-1 font-semibold text-sm">
            <p>Amount to be Paid</p>
            <p>₱{totalPrice()}</p>
          </div>
          <Link to={"/checkout"}>
            <Button className="w-full" size={"sm"}>
              Place Order
            </Button>
          </Link>

          <div className="flex gap-1">
            <DrawerClose asChild className="flex-1">
              <Button variant="outline" size={"sm"}>
                <EyeOff /> Hide Panel
              </Button>
            </DrawerClose>

            <CustomAlertDialog
              buttonText={"Void Order"}
              icon={<X />}
              handler={() => {
                clearCart();
              }}
            />

            <Button variant="outline" size={"sm"} className="flex-1">
              <Printer /> Print
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
