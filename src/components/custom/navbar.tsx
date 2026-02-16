import { LogOut, ReceiptText, Settings, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Button } from "../ui/button";
import Avatar from "boring-avatars";
import NavUser from "./nav-user";
import { useAuthStore } from "@/stores/auth-store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
    </header>
  );
}
