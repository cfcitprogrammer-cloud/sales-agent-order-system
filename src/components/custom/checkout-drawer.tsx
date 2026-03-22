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
import { Link, useNavigate } from "react-router-dom";
import CustomAlertDialog from "./dialogs/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";

export function CheckoutDrawer() {
  const { cart, totalPrice, clearCart } = useCartStore();

  const navigate = useNavigate();
  const {role} = useAuthStore()

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {["sales", "admin"].includes(role!) && <Button variant="outline" className="rounded-full" size={"icon-sm"} disabled={!["sales", "admin"].includes(role!)}>
          <ShoppingBasket />
        </Button>}
        
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between gap-1 flex-wrap">
          <DrawerTitle>Your Order</DrawerTitle>
          {/* <DrawerTitle>Order {generateCartId()}</DrawerTitle> */}
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
                {cart.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    <p className="text-lg font-medium">Cart is empty</p>
                    <p className="text-sm">Add items to start checkout</p>
                  </div>
                )}

                {cart.map((item) => (
                  <CheckoutItemCard key={item.cart_id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Separator />
          {/* <div className="text-sm">
            <h2 className="font-semibold">Payment Summary</h2>
            <div className="flex justify-between items-center gap-1">
              <p className="text-gray-500">Sub Total</p>
              <p>₱{totalPrice()}</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-1 font-semibold text-sm">
            <p>Amount to be Paid</p>
            <p>₱{totalPrice()}</p>
          </div> */}
          <Button
            className="w-full bg-amber-600 text-white hover:bg-amber-700"
            size={"sm"}
            disabled={cart.length === 0}
            onClick={() => navigate("/checkout")}
          >
            Place Order
          </Button>

          <div className="flex gap-1">
            <DrawerClose asChild className="flex-1">
              <Button variant="outline" size={"sm"}>
                <EyeOff /> Hide Panel
              </Button>
            </DrawerClose>

            <div className="flex-1">
              <CustomAlertDialog
                buttonText={"Void Order"}
                icon={<X />}
                handler={() => {
                  clearCart();
                }}
              />
            </div>

            {/* <Button variant="outline" size={"sm"} className="flex-1">
              <Printer /> Print
            </Button> */}
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
