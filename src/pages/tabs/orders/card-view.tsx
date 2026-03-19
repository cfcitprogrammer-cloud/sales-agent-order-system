import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/db/types/order.type";
import { orderStatusConfig } from "@/lib/order-status";
import { Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

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

  const pageSize = 9;

  function getDeliveryProgress(deliveryDate: string | null) {
    if (!deliveryDate) return 0;

    const today = new Date();
    const delivery = new Date(deliveryDate);

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    ).getTime();

    const end = delivery.getTime();

    const total = end - startOfToday;

    if (total <= 0) return 100;

    const now = Date.now();

    const progress = ((now - startOfToday) / total) * 100;

    return Math.min(Math.max(progress, 0), 100);
  }

  function getDaysLeft(deliveryDate: string | null) {
    if (!deliveryDate) return null;

    const today = new Date();
    const delivery = new Date(deliveryDate);

    const diff = delivery.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";

    return `${days} day${days > 1 ? "s" : ""} left`;
  }

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
    <div className="space-y-6">
      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {orders.map((order) => {
          const statusKey = order.status?.toLowerCase();
          const statusConfig = orderStatusConfig[statusKey];
          const StatusIcon = statusConfig?.icon;

          const progress =
            statusKey === "completed"
              ? 100
              : getDeliveryProgress(order.delivery_date);

          const daysLeft = getDaysLeft(order.delivery_date);

          return (
            <Card key={order.id} className="p-0 overflow-hidden shadow-sm">
              {/* HEADER */}
              <CardHeader
                className={`flex flex-row items-center justify-between px-4 py-3 ${
                  statusConfig?.color ?? "bg-slate-500 text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                    {StatusIcon && <StatusIcon size={16} />}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {order.customer_name}
                    </p>
                    <p className="text-xs opacity-80">{order.status}</p>
                  </div>
                </div>

                <span className="bg-white text-black text-xs px-2 py-1 rounded-md">
                  #{order.id}
                </span>
              </CardHeader>

              {/* BODY */}
              <CardContent className="space-y-3 text-sm p-4 flex-1 ">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <div>
                    <p className="font-semibold">Created At</p>
                    <p>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">Delivery Date</p>
                    <p>
                      {order.delivery_date
                        ? new Date(order.delivery_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-2 space-y-2">
                  {order.order_products?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-xs">×{item.qty}</span>
                    </div>
                  ))}

                  {order.notes && (
                    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      Notes: {order.notes}
                    </div>
                  )}
                </div>

                {/* DELIVERY PROGRESS */}
                <div>
                  <div className="flex items-center mb-2 text-xs text-muted-foreground">
                    <Calendar size={16} className="mr-1" />
                    {daysLeft}
                  </div>

                  <Progress
                    value={progress}
                    className={
                      statusKey === "completed" ? "[&>div]:bg-green-500" : ""
                    }
                  />
                </div>
              </CardContent>

              {/* FOOTER */}
              <CardFooter className="p-3">
                <Link to={`/order/details/${order.id}`} className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-amber-600 text-white hover:bg-amber-700"
                  >
                    View Order
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2">
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
