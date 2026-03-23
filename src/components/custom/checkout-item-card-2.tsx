import type { Product } from "@/db/types/product.type";

interface CheckoutItemCard2Props {
  item: Product;
}

export default function CheckoutItemCard2({ item }: CheckoutItemCard2Props) {
  return (
    <div className="flex items-start gap-1 cursor-pointer">
      <figure className="w-12 h-12 overflow-hidden rounded-lg relative">
        <img
          src={item.img_src || ""}
          alt={item.name}
          className="w-full h-full object-cover object-center text-xs"
        />
      </figure>
      <h1>{item.name}</h1>
    </div>
  );
}
