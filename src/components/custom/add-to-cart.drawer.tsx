import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Separator } from "../ui/separator";
import { useProductStore } from "@/stores/product-store";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export function AddToCartDrawer() {
  const { isAddToCartOpen, currentProduct, setAddToCartOpen } =
    useProductStore();

  return (
    <Drawer
      direction="bottom"
      open={isAddToCartOpen}
      onOpenChange={setAddToCartOpen}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{currentProduct?.name}</DrawerTitle>
          <DrawerDescription />
        </DrawerHeader>

        <div className="overflow-hidden w-full px-4">
          <h1 className="mb-2">Variants</h1>

          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {currentProduct?.product_variant?.map((variant) => (
                  <SelectItem key={variant.id} value={variant.id.toString()}>
                    {variant.alias}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <DrawerFooter>
          <Separator />

          <Button variant="secondary" onClick={() => setAddToCartOpen(false)}>
            Cancel
          </Button>

          <Button>Add to Cart</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
