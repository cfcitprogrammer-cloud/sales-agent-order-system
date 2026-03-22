import { AddToCartDrawer } from "@/components/custom/add-to-cart.drawer";
import { CheckoutDrawer } from "@/components/custom/checkout-drawer";
import ProductList from "@/components/custom/products-list";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCartStore } from "@/stores/cart-store";
import { ListFilter, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductsTab() {
  const { clearCart } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  // const { user, loading } = useAuthStore();

  function handleRefresh() {
    clearCart();
    toast.info("Refreshed");
  }

  return (
    <main>
      <header className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div>
          <h2 className="text-lg font-semibold">Our Products</h2>
          <p className="text-sm text-muted-foreground">
            Quality food that brings joy to your day.
          </p>
        </div>

        <nav className="flex items-center gap-1">
          <InputGroup className="bg-white">
            <InputGroupInput
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"outline"}
                size={"icon-sm"}
                className="rounded-full"
                onClick={handleRefresh}
              >
                <RefreshCw />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>

          <Button variant={"outline"} size={"icon-sm"} className="rounded-full">
            <ListFilter />
          </Button>

          <CheckoutDrawer />

          <AddToCartDrawer />
        </nav>
      </header>

      <section>
        <div>
          <ProductList searchQuery={searchQuery} />
        </div>
      </section>
    </main>
  );
}
