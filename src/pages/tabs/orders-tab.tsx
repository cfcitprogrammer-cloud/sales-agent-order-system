"use client";

import { useState } from "react";
import { useNavigate, useParams, createSearchParams } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import CardView from "./orders/card-view";
import TableView from "./orders/table-view";

import { Grid2x2, List, Search } from "lucide-react";

const statusOptions = [
  "All",
  "Pending",
  "Cancelled",
  "Approved",
  "Rejected",
  "Completed",
];

export default function OrdersTab() {
  const navigate = useNavigate();
  const { pageNumber = "1" } = useParams();

  const [view, setView] = useState<"card" | "table">("card");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  const goToPage = (pageNum: number) => {
    navigate({
      pathname: `/orders/${pageNum}`,
      search: createSearchParams({
        status: statusFilter ?? "",
        search: searchTerm ?? "",
      }).toString(),
    });
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Your Orders</h1>

        <div className="flex items-center gap-2">
          <Select onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <InputGroup className="bg-white">
            <InputGroupInput
              type="text"
              placeholder="Search orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <Search size={18} />
            </InputGroupAddon>
          </InputGroup>

          <ToggleGroup
            type="single"
            size="sm"
            value={view}
            onValueChange={(val: "card" | "table") => setView(val)}
            className="border rounded bg-white"
          >
            <ToggleGroupItem size="sm" value="card">
              <Grid2x2 size={16} />
            </ToggleGroupItem>

            <ToggleGroupItem size="sm" value="table">
              <List size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </header>

      <div>
        {view === "card" ? (
          <CardView
            page={Number(pageNumber)}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onPageChange={goToPage}
          />
        ) : (
          <TableView
            page={Number(pageNumber)}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onPageChange={goToPage}
          />
        )}
      </div>
    </section>
  );
}
