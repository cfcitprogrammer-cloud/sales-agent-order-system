"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import type { Order } from "@/db/types/order.type";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6F91",
];

export default function DashboardTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error(error.message);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    }

    fetchOrders();
  }, []);

  // Aggregate status counts for pie chart
  const statusData = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status ?? "Unknown"] = (acc[order.status ?? "Unknown"] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // Aggregate total orders per day for bar chart
  const ordersByDate: Record<string, number> = {};
  orders.forEach((order) => {
    const date = order.created_at?.slice(0, 10) || "Unknown";
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  const barData = Object.entries(ordersByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders per Day */}
        <Card>
          <CardHeader>
            <CardTitle>Orders per Day</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Summary cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold">{statusData["Pending"] || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold">{statusData["Approved"] || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{statusData["Completed"] || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
