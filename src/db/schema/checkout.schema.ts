import { z } from "zod";

// Checkout form values now map directly to your `Order` type
export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"), // maps to customer_name
  bpCode: z.string().min(1, "BP code is required"), // maps to bp_code
  city: z.string().optional(),
  street: z.string().optional(),
  deliveryDate: z.string().min(1, "Delivery date is required"), // maps to delivery_date
  notes: z.string().optional(),

  // Cart items must be non-empty and match CartItem
  cart: z
    .array(
      z.object({
        cart_id: z.string(),
        cart_qty: z.number().min(1),
        product_id: z.number(),
        product_name: z.string(),
        product_img: z.string().nullable(),
        variant_id: z.number(),
        variant_name: z.string(),
        price: z.number(),
        sku: z.string(),
        uom: z.string(),
      }),
    )
    .min(1, "At least one product is required"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
