import { z } from "zod";

// Checkout form values now map directly to your `Order` type
export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"), // maps to customer_name
  contactNumber: z.string().optional(), // maps to contact_number
  email: z.string().email().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  province: z.string().optional(),
  coor: z.string().optional(),
  deliveryDate: z.string().optional(), // maps to delivery_date
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
