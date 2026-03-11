import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

export default function OrdersTab() {
  return (
    <section>
      <header className="flex items-center justify-between gap-2 ">
        <h1>Your Orders</h1>

        <div className="flex items-center gap-2">
          <p>New Order</p>
          <p>Pending</p>
          <p>Cancelled</p>
          <p>Reviewed</p>
          <p>Approved</p>
          <p>Rejected</p>
          <p>Completed</p>
        </div>

        <div>
          <InputGroup>
            <InputGroupInput type="text" placeholder="Search" />
            <InputGroupAddon align="inline-end">
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </header>
    </section>
  );
}
