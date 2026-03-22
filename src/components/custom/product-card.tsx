import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import type { Product } from "@/db/types/product.type";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
import { Badge } from "../ui/badge";
import { stringToColor } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { setCurrentProduct, setAddToCartOpen } = useProductStore();
  const { role } = useAuthStore()

  function addToCartBtn() {
    setCurrentProduct(product);
    setAddToCartOpen(true);
  }

  return (
    <Card className="flex-col">
      <CardContent className="space-y-2 flex-1">
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

          <Badge
            style={{ backgroundColor: stringToColor(product.category || "") }}
          >
            {product.category}
          </Badge>
        </div>
        <h2 className="font-semibold text-xs">{product.name}</h2>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-2 flex-1">
          {["sales", "admin"].includes(role!) && <Button
            className="w-full bg-amber-600 text-white hover:bg-amber-700"
            size={"sm"}
            onClick={addToCartBtn}
            disabled={!["sales", "admin"].includes(role!)}
          >
            Add to Cart
          </Button>}
        </div>
      </CardFooter>
    </Card>
  );
}
