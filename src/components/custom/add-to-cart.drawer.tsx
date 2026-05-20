import { useState, useEffect } from "react";
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

  // Local state to manage the "raw" text in the input
  const [inputValue, setInputValue] = useState(quantity.toString());

  // Keep local input in sync when global quantity changes (via +/- buttons)
  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleClose = () => {
    setAddToCartOpen(false);
    clearCurrentProduct();
  };

  const handleAddToCart = () => {
    if (!currentProduct || !selectedVariant) return;
    // Ensure we aren't adding 0 if the user left it blank
    const finalQty = Math.max(1, parseInt(inputValue) || 1);
    addToCart(currentProduct, selectedVariant, finalQty);
    handleClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string so user can backspace fully
    setInputValue(value);

    // If it's a valid number >= 1, update the global store
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed > 0) {
      setQuantity(parsed);
    }
  };

  const handleBlur = () => {
    // Safety: if the user leaves it empty or 0, reset to 1
    const parsed = parseInt(inputValue);
    if (isNaN(parsed) || parsed < 1) {
      setInputValue("1");
      setQuantity(1);
    }
  };

  return (
    <Drawer
      direction="bottom"
      open={isAddToCartOpen}
      onOpenChange={handleClose}
    >
      <DrawerContent className="max-h-[96vh] flex flex-col">
        <DrawerHeader className="flex flex-col gap-4 items-center sm:flex-row sm:items-start shrink-0">
          <div className="w-24 h-24 bg-muted rounded-md overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={currentProduct?.img_src || undefined}
              alt={currentProduct?.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center sm:text-left">
            <DrawerTitle className="text-xl">
              {currentProduct?.name}
            </DrawerTitle>
            <DrawerDescription className="mt-1">
              {selectedVariant
                ? `${selectedVariant.sku} - ${selectedVariant.alias} [${selectedVariant.uom}]`
                : `Select a variant to see details`}
            </DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          <div className="space-y-3">
            <h1 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Variant
            </h1>
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
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {currentProduct?.product_variant?.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id.toString()}>
                      {variant.alias} [{variant.uom}]
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex flex-wrap justify-between items-center gap-4">
            <h1 className="font-semibold">Quantity</h1>

            <ButtonGroup className="h-10">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <Input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="w-16 text-center border-x-0 rounded-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <Button variant="outline" size="icon" onClick={increaseQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        <DrawerFooter className="shrink-0 border-t mt-2">
          <div className="flex flex-row gap-3">
            <Button className="flex-1" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              className="flex-[2] bg-amber-600 text-white hover:bg-amber-700"
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
