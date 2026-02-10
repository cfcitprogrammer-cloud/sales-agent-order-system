import { CheckoutDrawer } from "@/components/custom/checkout-drawer";
import ProductList from "@/components/custom/products-list";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ListFilter, RefreshCw, Search } from "lucide-react";

export default function ProductsTab() {
  return (
    <main>
      <header className="flex justify-between items-center">
        <p>Our Products</p>

        <nav className="flex items-center gap-1">
          <InputGroup>
            <InputGroupInput type="text" placeholder="Search" />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>

          <Button variant={"outline"} size={"icon-sm"} className="rounded-full">
            <RefreshCw />
          </Button>

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
