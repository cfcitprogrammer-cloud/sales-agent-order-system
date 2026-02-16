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
import { toast } from "sonner";

export default function ProductsTab() {
  const { clearCart } = useCartStore();
  // const { user, loading } = useAuthStore();

  function handleRefresh() {
    clearCart();
    toast.info("Refreshed");
  }

  // useEffect(() => {
  //   if (user && !loading) {
  //     alert("DONE");
  //   }
  // }, [user, loading]);

  return (
    <main>
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Our Products</h2>

        <nav className="flex items-center gap-1">
          <InputGroup>
            <InputGroupInput type="text" placeholder="Search" />
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
        </nav>
      </header>

      <section>
        <div>
          <ProductList />
        </div>
      </section>
    </main>
  );
}
