import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function CheckoutItemCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-1">
      <CardContent className="p-1 text-sm">
        {/* FIRST DIV */}
        <div
          onClick={() => setOpen(true)}
          className="flex justify-between items-center gap-1 cursor-pointer"
        >
          <div>
            <h1>Mini Do Choco 40g</h1>
            <p>40g | 50 pcs</p>
          </div>

          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()} // prevent accidental re-triggers
          >
            <Button
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
            >
              <Minus />
            </Button>
            <p>1</p>
            <Button
              className="rounded-full"
              size={"icon-xs"}
              variant={"outline"}
            >
              <Plus />
            </Button>
          </div>
        </div>

        {/* SECOND DIV */}
        {open && (
          <div className="mt-2">
            <Table className="text-center">
              <TableHeader>
                <TableHead className="text-center">Item Rate</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Total</TableHead>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>₱33</TableCell>
                  <TableCell>₱100</TableCell>
                  <TableCell>₱300</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
