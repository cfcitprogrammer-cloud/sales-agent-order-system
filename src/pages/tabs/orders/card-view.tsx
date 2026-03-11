import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/db/types/order.type";

interface CardViewProps {
  page: number;
  statusFilter?: string;
  searchTerm?: string;
  onPageChange: (page: number) => void;
}

export default function CardView({
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}: CardViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 9; // 9 cards per page

  useEffect(() => {
    async function fetchOrders() {
      let query = supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("id", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (statusFilter) query = query.eq("status", statusFilter);
      if (searchTerm) query = query.ilike("customer_name", `%${searchTerm}%`);

      const { data, count, error } = await query;
      if (error) {
        console.error(error);
        return;
      }
      setOrders(data || []);
      setTotalPages(Math.ceil((count ?? 0) / pageSize));
    }

    fetchOrders();
  }, [page, statusFilter, searchTerm]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {orders.map((order) => (
        <div key={order.id} className="border p-4 rounded shadow">
          <h2 className="font-semibold">{order.customer_name}</h2>
          <p>Status: {order.status}</p>
          <p>Delivery: {order.delivery_date ?? "N/A"}</p>
          <Button size="sm" className="mt-2">
            View Details
          </Button>
        </div>
      ))}

      <div className="col-span-full flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "outline"}
            onClick={() => onPageChange(i + 1)}
            size="sm"
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}
