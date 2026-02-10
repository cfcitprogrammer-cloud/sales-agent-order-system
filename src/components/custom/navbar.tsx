import { LogOut, ReceiptText, Settings, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import Avatar from "boring-avatars";
import NavUser from "./nav-user";

export default function NavbarComponent() {
  return (
    <header className="flex justify-between items-center p-4">
      <p>Sales Agent Booking</p>

      <TabsList className="w-[400px]">
        <TabsTrigger value="dashboard">
          <ReceiptText /> Dashboard
        </TabsTrigger>
        <TabsTrigger value="products">
          <ShoppingBag /> Products
        </TabsTrigger>
        <TabsTrigger value="orders">
          <ReceiptText /> Orders
        </TabsTrigger>
      </TabsList>

      <div className="right-side flex gap-1 items-center">
        <Button size={"icon-sm"} className="rounded-full" variant={"outline"}>
          <LogOut />
        </Button>
        <Button size={"icon-sm"} className="rounded-full" variant={"outline"}>
          <Settings />
        </Button>
        <NavUser />
      </div>
    </header>
  );
}
