import { LogOut, Menu, ReceiptText, ShoppingBag } from "lucide-react";
import { TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import NavUser from "./nav-user";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

export default function NavbarComponent() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  async function logOut() {
    try {
      const t = toast.loading("Signing Out...");

      signOut().then(() => {
        navigate("/login", { replace: true });
        toast.dismiss(t);
      });
    } catch (error: any) {
      toast.error(`Unexpected Error: ${error.message || error}`);
    }
  }

  return (
    <header className="flex justify-between items-center px-4 py-2 fixed top-0 left-0 w-full bg-white z-10">
      <p className="text-sm font-semibold text-amber-600">
        Sales Agent Booking
      </p>

      <TabsList className="hidden md:block">
        <TabsTrigger
          value="dashboard"
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
        >
          <ReceiptText /> Dashboard
        </TabsTrigger>

        <TabsTrigger
          value="products"
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
        >
          <ShoppingBag /> Products
        </TabsTrigger>

        <TabsTrigger
          value="orders"
          className="data-[state=active]:bg-amber-500 data-[state=active]:text-white"
        >
          <ReceiptText /> Orders
        </TabsTrigger>
      </TabsList>

      <div className="hidden md:flex right-side gap-1 items-center">
        <Button
          // asChild
          size={"icon-sm"}
          className="rounded-full"
          variant={"outline"}
          onClick={logOut}
        >
          <LogOut />
        </Button>
        {/* 
        <Button size={"icon-sm"} className="rounded-full" variant={"outline"}>
          <Settings />
        </Button> */}
        <NavUser />
      </div>

      <div className="block md:hidden">
        <Dialog>
          <DialogTrigger>
            <Menu />
          </DialogTrigger>
          <DialogContent>
            <TabsList className="w-full flex flex-col mt-6">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white w-full"
              >
                <ReceiptText /> Dashboard
              </TabsTrigger>

              <TabsTrigger
                value="products"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white w-full"
              >
                <ShoppingBag /> Products
              </TabsTrigger>

              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white w-full"
              >
                <ReceiptText /> Orders
              </TabsTrigger>
            </TabsList>

            <div className="right-side flex flex-col gap-1 items-center">
              <Button
                // asChild
                size={"icon-sm"}
                className="rounded-full w-full"
                variant={"outline"}
                onClick={logOut}
              >
                <LogOut /> Log Out
              </Button>
              {/* 
        <Button size={"icon-sm"} className="rounded-full" variant={"outline"}>
          <Settings />
        </Button> */}
              <NavUser />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
