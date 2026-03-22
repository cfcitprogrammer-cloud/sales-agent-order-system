"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/db/types/order.type";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown } from "lucide-react";

interface TableViewProps {
  page: number;
  statusFilter?: string;
  searchTerm?: string;
  onPageChange: (page: number) => void;
}

const statuses = [
  "Pending",
  "Cancelled",
  "Reviewed",
  "Approved",
  "Rejected",
  "Completed",
];

const statusTimestampFieldMap: Record<string, keyof Order> = {
  Pending: "pending_at",
  Cancelled: "cancelled_at",
  Reviewed: "reviewed_at",
  Approved: "approved_at",
  Rejected: "rejected_at",
  Completed: "completed_at",
};

const roleStatusMap: Record<string, string[]> = {
  logistic: ["Cancelled", "Reviewed", "Completed"],
  sales: ["Cancelled"],
  accounting: ["Cancelled", "Pending", "Approved", "Rejected"],
  admin: [
    "Pending",
    "Cancelled",
    "Reviewed",
    "Approved",
    "Rejected",
    "Completed",
  ],
};

export default function TableView({
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}: TableViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false)
  const pageSize = 10;
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      let query = supabase
        .from("orders")
        .select("*", { count: "exact" })
        .order("id", { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (statusFilter) query = query.eq("status", statusFilter);
      if (searchTerm) query = query.ilike("customer_name", `%${searchTerm}%`);

      const { data, count, error } = await query;
      if (error) {
        toast.error(error.message);
        setLoading(false)
        return;
      }
      setOrders(data || []);
      setTotalPages(Math.ceil((count ?? 0) / pageSize));
      setSelectedIds([]);
      setLoading(false)
    }

    fetchOrders();
  }, [page, statusFilter, searchTerm]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const changeStatus = async (order: Order, newStatus: string) => {
    if (!role) return;

    // Enforce flow
    const flowOrder: string[] = [
      "Pending",
      "Cancelled",
      "Reviewed",
      "Approved",
      "Rejected",
      "Completed",
    ];
    const currentIndex = flowOrder.indexOf(order.status);
    const newIndex = flowOrder.indexOf(newStatus);

    if (newIndex < currentIndex) {
      toast.error(
        `Cannot move status backwards from ${order.status} to ${newStatus}`,
      );
      return;
    }

    setUpdatingIds((prev) => [...prev, order.id]);

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
      toast.success(`Order #${order.id} updated to ${newStatus}`, {id: tloading});
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updateData } : o)),
      );
    }

    setUpdatingIds((prev) => prev.filter((id) => id !== order.id));
  };

  // Mass action handler
  const massUpdateStatus = async (newStatus: string) => {
    if (!role || selectedIds.length === 0) return;

    for (const id of selectedIds) {
      const orderItem = orders.find((o) => o.id === id);
      if (orderItem) await changeStatus(orderItem, newStatus);
    }
    setSelectedIds([]);
  };

  if (loading) {
    return <div className="w-full h-60 flex items-center justify-center">
      <Spinner />
    </div>
  }

  return (
    <div className="space-y-4">
      {/* Mass action dropdown */}
      {selectedIds.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">Mass Actions ({selectedIds.length})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[
              "Pending",
              "Cancelled",
              "Reviewed",
              "Approved",
              "Rejected",
              "Completed",
            ]
              .filter((s) => roleStatusMap[role!]?.includes(s))
              .map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => massUpdateStatus(status)}
                >
                  {status}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div className="bg-white p-2 rounded">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={
                  selectedIds.length === orders.length && orders.length > 0
                }
                onCheckedChange={(checked) =>
                  setSelectedIds(checked ? orders.map((o) => o.id) : [])
                }
              />
            </TableHead>
            <TableHead>BP Code</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => {
            const visibleStatuses = role ? (roleStatusMap[role] ?? []) : [];
            return (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(order.id)}
                    onCheckedChange={() => toggleSelection(order.id)}
                  />
                </TableCell>
                <TableCell>{order.bp_code}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell>{order.delivery_date ?? "N/A"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingIds.includes(order.id)}
                      >
                        {order.status}
                        <ChevronDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {visibleStatuses
                        .filter((status) => {
                          const allowedStatuses = roleStatusMap[role || ""] || [];

                          // check if status is allowed for role
                          if (!allowedStatuses.includes(status)) return false;

                          // additional rule for logistic "Completed"
                          if (role === "logistic" && status === "Completed") {
                            return order.status === "Approved";
                          }

                          return true;
                        })
                        .map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => changeStatus(order, status)}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right">
                  <Link to={`/order/details/${order.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
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
