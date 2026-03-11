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
import { useCartStore } from "@/stores/cart-store";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { ButtonGroup } from "../ui/button-group";
import { Input } from "../ui/input";
import { Minus, Plus } from "lucide-react";

export function AddToCartDrawer() {
  const {
    isAddToCartOpen,
    currentProduct,
    selectedVariant,
    quantity,

    setSelectedVariant,
    setQuantity,
    increaseQuantity,
    decreaseQuantity,

    setAddToCartOpen,
    clearCurrentProduct,
  } = useProductStore();

  const addToCart = useCartStore((state) => state.addToCart);

  const handleClose = () => {
    setAddToCartOpen(false);
    clearCurrentProduct();
  };

  const handleAddToCart = () => {
    if (!currentProduct || !selectedVariant) return;

    addToCart(currentProduct, selectedVariant, quantity);

    handleClose();
  };

  return (
    <Drawer
      direction="bottom"
      open={isAddToCartOpen}
      onOpenChange={handleClose}
    >
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{currentProduct?.name}</DrawerTitle>
          <DrawerDescription>
            {selectedVariant
              ? `₱${selectedVariant.price | 0}`
              : "Select variant"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-hidden w-full px-4 space-y-4">
          <h1 className="font-semibold">Variant</h1>

          <Select
            value={selectedVariant?.id.toString()}
            onValueChange={(value) =>
              setSelectedVariant(
                currentProduct?.product_variant?.find(
                  (v) => v.id === Number(value),
                ) ?? null,
              )
            }
          >
            <SelectTrigger className="w-full">
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

          <Separator />

          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="font-semibold">Quantity</h1>

            <ButtonGroup>
              <Button variant="outline" onClick={decreaseQuantity}>
                <Minus />
              </Button>

              <Input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 text-center"
              />

              <Button variant="outline" onClick={increaseQuantity}>
                <Plus />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <DrawerFooter>
          <Separator />

          <div className="flex flex-wrap gap-4">
            <Button
              className="flex-1"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              className="flex-1"
              disabled={!selectedVariant}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
