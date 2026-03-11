import { useEffect } from "react";
import ProductCard from "./product-card";
import { useProductStore } from "@/stores/product-store";

export default function OrdersList() {
  const { getProducts, products } = useProductStore();

  async function fetchProducts() {
    await getProducts();
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  );
}
