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

export function CheckoutDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="rounded-full" size={"icon-sm"}>
          <ShoppingBasket />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-row items-center justify-between gap-1 flex-wrap">
          <DrawerTitle>Order #123434</DrawerTitle>
          <DrawerDescription>08 Oct 2025, 12:44 PM</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="flex items-center justify-between gap-1">
            <p>Your Cart</p>

            <p>Total: 4</p>
          </div>
          <div className="no-scrollbar overflow-y-auto">
            <CheckoutItemCard />
          </div>
        </div>
        <DrawerFooter>
          <Separator />
          <div className="text-sm">
            <h2 className="font-semibold">Payment Summary</h2>
            <div className="flex justify-between items-center gap-1">
              <p className="text-gray-500">Sub Total</p>
              <p>$267</p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-1 font-semibold text-sm">
            <p>Amount to be Paid</p>
            <p>$267</p>
          </div>
          <Button size={"sm"}>Place Order</Button>

          <div className="flex gap-1">
            <DrawerClose asChild className="flex-1">
              <Button variant="outline" size={"sm"}>
                <EyeOff /> Hide Panel
              </Button>
            </DrawerClose>

            <Button variant="outline" size={"sm"} className="flex-1">
              <X /> Void Order
            </Button>

            <Button variant="outline" size={"sm"} className="flex-1">
              <Printer /> Print
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
