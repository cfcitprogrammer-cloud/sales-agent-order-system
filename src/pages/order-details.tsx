"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { useAuthStore } from "@/stores/auth-store";
import type { Order } from "@/db/types/order.type";
import OrderTimeline from "@/components/custom/order-timeline";
import * as XLSX from "xlsx";

const statuses = [
  "Pending",
  "Cancelled",
  "Reviewed",
  "Approved",
  "Rejected",
  "Completed",
];

// Role visibility mapping
const roleStatusMap: Record<string, string[]> = {
  logistic: ["Cancelled", "Reviewed", "Completed"],
  sales: ["Cancelled"],
  accounting: ["Cancelled", "Pending", "Approved", "Rejected"],
  admin: statuses,
};

// Map each status to its timestamp field
const statusTimestampFieldMap: Record<string, keyof Order> = {
  Pending: "pending_at",
  Cancelled: "cancelled_at",
  Reviewed: "reviewed_at",
  Approved: "approved_at",
  Rejected: "rejected_at",
  Completed: "completed_at",
};

// Status transition flow
const statusFlowMap: Record<string, string[]> = {
  Pending: ["Reviewed", "Cancelled"],
  Cancelled: [],
  Reviewed: ["Approved", "Rejected"],
  Approved: ["Completed"],
  Rejected: [],
  Completed: [],
};

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const role = useAuthStore((state) => state.role);

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const visibleStatuses = role ? (roleStatusMap[role] ?? []) : [];

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

    const timestampField = statusTimestampFieldMap[newStatus];

    const updateData: Partial<Order> = { status: newStatus };
    if (timestampField)
      updateData[timestampField] = new Date().toISOString() as any;


    const tloading = toast.loading("Updating order status...")
    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", order.id);

    if (error) {
      toast.error(error.message || "Failed to update status", {id: tloading});
    } else {
      setOrder({ ...order, ...updateData });
      toast.success(`Order status updated to ${newStatus}`, {id: tloading});
    }

    setUpdatingStatus(false);
  };

  const exportToExcel = () => {
    if (!order || !order.order_products) return;

    const data = order.order_products.map((item) => ({
      "Product Name": item.product_name,
      "Item Description": item.variant_name,
      "Item Code": item.sku,
      UOM: item.uom,
      Quantity: item.qty,
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Apply fill color to header row
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;

      ws[cellAddress].s = {
        fill: {
          patternType: "solid",
          fgColor: { rgb: "FFD700" }, // gold
        },
        font: {
          bold: true,
          color: { rgb: "000000" },
        },
      };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Products");

    XLSX.writeFile(wb, `order_${order.id}_products.xlsx`);
  };

  if (loading) return <p className="p-6">Loading order details...</p>;
  if (!order) return <p className="p-6 text-red-600">Order not found</p>;

  const totalPrice = order.order_products?.reduce(
    (sum, item) => sum + item.price_at_order * item.qty,
    0,
  );

  const allowedStatuses = statuses.filter((status) => {
    // 1. must be visible in UI
    if (!visibleStatuses.includes(status)) return false;

    // 2. must be allowed for role
    const allowedForRole = roleStatusMap[role || ""] || [];
    if (!allowedForRole.includes(status)) return false;

    // 3. workflow rule (status transitions)
    const allowedNext = statusFlowMap[order.status] ?? [];
    const isValidTransition =
      allowedNext.includes(status) || order.status === status;

    if (!isValidTransition) return false;

    // 4. special business rule
    if (role === "logistic" && status === "Completed") {
      return order.status === "Approved";
    }

    return true;
  });

  return (
    <section className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="font-semibold">Order #{order.id}</h1>
        <div className="flex gap-2">
          <Button size={"sm"} onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button size={"sm"} onClick={exportToExcel} variant="outline">
            Export to Excel
          </Button>
        </div>
      </header>

      <div className="space-y-2 mt-4 text-sm">
        <p>
          <strong>BP Code:</strong> {order.bp_code ?? "N/A"}
        </p>
        <p>
          <strong>Customer:</strong> {order.customer_name}
        </p>
        <p>
          <strong>Street:</strong> {order.street ?? "N/A"}
        </p>
        <p>
          <strong>City:</strong> {order.city ?? "N/A"}
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
        <h2 className="font-semibold">Products</h2>

        <ButtonGroup>
          {allowedStatuses.map((status) => (
            <Button
              size={"sm"}
              key={status}
              variant={order.status === status ? "default" : "outline"}
              onClick={() => changeStatus(status)}
              disabled={updatingStatus || order.status === status}
            >
              {status}
            </Button>
          ))}
        </ButtonGroup>
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
                {/* {item.qty} × ₱{item.price_at_order.toFixed(2)} */}x{" "}
                {item.qty}
              </p>
              <p className="font-medium">
                {/* ₱{(item.qty * item.price_at_order).toFixed(2)} */}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* <Separator /> */}

      {/* <div className="flex justify-end items-center gap-4">
        <p className="text-lg font-semibold">
          Total: ₱{totalPrice?.toFixed(2)}
        </p>
      </div> */}

      <Separator />

      <OrderTimeline order={order} />
    </section>
  );
}
