import { z } from "zod";
import type { Product } from "@/db/types/product";
import type { CartItem } from "@/stores/cart-store";

export const checkoutSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  customerName: z.string().min(1, "Customer name is required"),
  address: z.string().min(1, "Address is required"),
  province: z.string().optional(),
  city: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  receivingTime: z.string().min(1, "Receiving time is required"),
  notes: z.string().optional(),

  // 👇 Product[] without productSchema
  cart: z
    .custom<CartItem[]>()
    .refine((val) => Array.isArray(val) && val.length > 0, {
      message: "At least one product is required",
    }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
