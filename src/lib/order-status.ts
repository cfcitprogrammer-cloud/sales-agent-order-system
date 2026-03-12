import { Clock, XCircle, CheckCircle, Ban, PackageCheck } from "lucide-react";

export const orderStatusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Clock,
  },

  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: XCircle,
  },

  approved: {
    label: "Approved",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle,
  },

  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: Ban,
  },

  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: PackageCheck,
  },
};
