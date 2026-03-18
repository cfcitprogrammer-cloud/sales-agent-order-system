import { useEffect, useState } from "react";
import ProductCard from "./product-card";
import { useProductStore } from "@/stores/product-store";
import type { Product } from "@/db/types/product.type";
import { Spinner } from "../ui/spinner";

interface ProductListProps {
  searchQuery: string;
}

export default function ProductList({ searchQuery }: ProductListProps) {
  const { getProducts, products } = useProductStore();
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch products on mount
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      await getProducts();
      setLoading(false);
    }
    fetchProducts();
  }, [getProducts]);

  // Filter products based on search query (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Group filtered products by category
  const productsByCategory: Record<string, Product[]> = filteredProducts.reduce(
    (acc: Record<string, Product[]>, product: Product) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    },
    {},
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No products found.</p>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(productsByCategory).map(
        ([category, productsInCategory]) => (
          <section key={category}>
            <h2 className="text-lg font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {productsInCategory.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ),
      )}
    </div>
  );
}
