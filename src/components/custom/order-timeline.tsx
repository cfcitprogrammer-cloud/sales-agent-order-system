// components/OrderTimeline.tsx
import { Clock, CheckCircle2, XCircle, Truck, FileCheck } from "lucide-react";
import type { Order } from "@/db/types/order.type";

interface Props {
  order: Order;
}

export default function OrderTimeline({ order }: Props) {
  const steps = [
    {
      status: "Pending",
      label: "Order Created",
      timestamp: order.pending_at,
      icon: Clock,
    },
    {
      status: "Cancelled",
      label: "Order Cancelled",
      timestamp: order.cancelled_at,
      icon: XCircle,
    },
    {
      status: "Reviewed",
      label: "Reviewed by Logistics",
      timestamp: order.reviewed_at,
      icon: FileCheck,
    },
    {
      status: "Approved",
      label: "Approved by Accounting",
      timestamp: order.approved_at,
      icon: CheckCircle2,
    },
    {
      status: "Rejected",
      label: "Rejected by Accounting",
      timestamp: order.rejected_at,
      icon: XCircle,
    },
    {
      status: "Completed",
      label: "Order Completed",
      timestamp: order.completed_at,
      icon: Truck,
    },
  ];

  const visibleSteps = steps.filter((step) => step.timestamp);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Order Timeline</h2>

      <div className="space-y-6">
        {visibleSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === visibleSteps.length - 1;

          return (
            <div key={step.status} className="flex gap-4">
              {/* Icon + vertical line */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-full border bg-muted">
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && <div className="w-0.5 flex-1 bg-border mt-1"></div>}
              </div>

              {/* Step content */}
              <div className="flex flex-col">
                <p className="font-medium text-sm">{step.label}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(step.timestamp as string).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
