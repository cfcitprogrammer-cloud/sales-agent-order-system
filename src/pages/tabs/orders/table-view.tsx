import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/db/types/order.type";

import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

interface TableViewProps {
  page: number;
  statusFilter?: string;
  searchTerm?: string;
  onPageChange: (page: number) => void;
}

export default function TableView({
  page,
  statusFilter,
  searchTerm,
  onPageChange,
}: TableViewProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

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
        toast.error(error.message);
        return;
      }
      setOrders(data || []);
      setTotalPages(Math.ceil((count ?? 0) / pageSize));
      setSelectedIds([]);
    }

    fetchOrders();
  }, [page, statusFilter, searchTerm]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const massApprove = async () => {
    if (selectedIds.length === 0) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "APPROVED" })
      .in("id", selectedIds);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Approved ${selectedIds.length} orders`);
      setSelectedIds([]);
      onPageChange(page);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mass approve button */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button size="sm" onClick={massApprove}>
            Approve Selected ({selectedIds.length})
          </Button>
        </div>
      )}

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
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(order.id)}
                  onCheckedChange={() => toggleSelection(order.id)}
                />
              </TableCell>
              <TableCell>{order.customer_name}</TableCell>
              <TableCell>{order.contact_number ?? "N/A"}</TableCell>
              <TableCell>{order.email ?? "N/A"}</TableCell>
              <TableCell>
                {order.address}, {order.city}, {order.province}
              </TableCell>
              <TableCell>{order.delivery_date ?? "N/A"}</TableCell>
              <TableCell>{order.status ?? "N/A"}</TableCell>
              <TableCell className="text-right">
                <Link to={`/order/details/${order.id}`}>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
