"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { Order } from "@/db/types/order.type";

const statuses = ["Pending", "Cancelled", "Approved", "Rejected", "Completed"];

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_products (
            id,
            product_name,
            variant_name,
            sku,
            uom,
            price_at_order,
            qty,
            img_src
          )
        `,
        )
        .eq("id", parseInt(orderId!))
        .single();

      if (error) {
        toast.error(error.message || "Failed to fetch order");
        setOrder(null);
      } else {
        setOrder({ ...data, order_products: data.order_products });
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  const changeStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdatingStatus(true);

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      toast.error(error.message || "Failed to update status");
    } else {
      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    }

    setUpdatingStatus(false);
  };

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found</p>;

  const totalPrice = order.order_products?.reduce(
    (sum, item) => sum + item.price_at_order * item.qty,
    0,
  );

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </header>

      <div className="space-y-2 mt-4">
        <p>
          <strong>Customer:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Contact:</strong> {order.contact_number ?? "N/A"} |{" "}
          {order.email ?? "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {order.address}, {order.city},{" "}
          {order.province}
        </p>
        <p>
          <strong>Delivery Date:</strong> {order.delivery_date ?? "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        {order.notes && (
          <p>
            <strong>Notes:</strong> {order.notes}
          </p>
        )}
      </div>

      <Separator />

      <div className="flex justify-between gap-4">
        <h2 className="text-xl font-semibold">Products</h2>

        <div>
          <ButtonGroup>
            {statuses.map((status) => (
              <Button
                key={status}
                variant={order.status === status ? "default" : "outline"}
                onClick={() => changeStatus(status)}
                disabled={updatingStatus}
              >
                {status}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
      <div className="space-y-4">
        {order.order_products?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded p-4"
          >
            <div className="flex items-center gap-4">
              {item.img_src && (
                <img
                  src={item.img_src}
                  alt={item.product_name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm">{item.variant_name}</p>
                <p className="text-xs text-muted-foreground">{item.sku}</p>
                <p className="text-xs">{item.uom}</p>
              </div>
            </div>
            <div className="text-right">
              <p>
                {item.qty} × ₱{item.price_at_order.toFixed(2)}
              </p>
              <p className="font-medium">
                ₱{(item.qty * item.price_at_order).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex justify-end items-center gap-4">
        <p className="text-lg font-semibold">
          Total: ₱{totalPrice?.toFixed(2)}
        </p>
      </div>
    </section>
  );
}
