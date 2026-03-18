import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import type { Product } from "@/db/types/product.type";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
import { Badge } from "../ui/badge";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { setCurrentProduct, setAddToCartOpen } = useProductStore();

  function addToCartBtn() {
    setCurrentProduct(product);
    setAddToCartOpen(true);
  }

  return (
    <Card>
      <CardContent className="space-y-2">
        <figure className="overflow-hidden rounded-lg h-48 w-full flex items-center justify-center bg-gray-100">
          <img
            src={product.img_src || undefined}
            alt={product.name}
            className="max-h-full max-w-full object-contain text-center text-xs"
          />
        </figure>
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            {product.product_variant?.length} variants
          </p>

          <Badge>Bihon</Badge>
        </div>
        <h2 className="font-semibold text-xs">{product.name}</h2>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 flex-1">
          <Button className="w-full" size={"sm"} onClick={addToCartBtn}>
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
