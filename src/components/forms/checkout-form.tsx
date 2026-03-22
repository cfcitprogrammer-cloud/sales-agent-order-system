import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/db/schema/checkout.schema";

import { useCartStore } from "@/stores/cart-store";
import CheckoutItemCard from "../custom/checkout-item-card";
import { useNavigate } from "react-router-dom";
import CustomAlertDialog from "../custom/dialogs/alert-dialog";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

type CheckoutFormProps = {
  onSubmit: (values: CheckoutFormValues) => Promise<boolean>;
};

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const navigate = useNavigate();

  const [customerQuery, setCustomerQuery] = useState("");
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      bpCode: "",
      street: "",
      city: "",
      deliveryDate: "",
      notes: "",
      cart,
    },
  });

  // Sync cart
  useEffect(() => {
    form.setValue("cart", cart);
  }, [cart, form]);

  // 🔍 Debounced search
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!customerQuery) {
        setCustomerResults([]);
        return;
      }

      setLoadingCustomers(true);

      const { data, error } = await supabase
        .from("bpmd")
        .select("*")
        .ilike("customer_name", `%${customerQuery}%`)
        .limit(5);

      if (!error) {
        setCustomerResults(data || []);
      }

      setLoadingCustomers(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [customerQuery]);

  function clearCartAndBack() {
    clearCart();
    navigate("/products/1", { replace: true });
  }

  function back() {
    navigate("/products/1", { replace: true });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async (data) => {
            const isSuccess = await onSubmit(data);
            if (isSuccess) {
              navigate("/products/1", { replace: true });
              toast.success("Order placed successfully");
            } else {
              toast.error("Failed to place order.");
            }
          },
          (errors) => {
            if (errors.cart) setError(errors.cart.message || "");
            toast.error("Validation failed.");
          },
        )}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* LEFT */}
        <div className="space-y-4">
          {/* BP CODE */}
          <FormField
            control={form.control}
            name="bpCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BP Code</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
              </FormItem>
            )}
          />

          {/* 🔍 CUSTOMER SEARCH */}
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Combobox
                    onValueChange={(value) => {
                      const selected = customerResults.find(
                        (c) => c.id === value,
                      );

                      console.log("SELECTED:", selected); // 👈 debug

                      if (selected) {
                        // ✅ Correct mapping
                        field.onChange(selected.customer_name);

                        form.setValue("street", selected.ship_to_street || "");
                        form.setValue("city", selected.ship_to_city || "");
                        form.setValue("bpCode", selected.bp_code || "");
                      }
                    }}
                  >
                    <ComboboxInput
                      placeholder="Search customer..."
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setCustomerQuery(e.target.value);
                      }}
                    />

                    <ComboboxContent>
                      <ComboboxList>
                        {loadingCustomers && (
                          <p className="p-2 text-sm">Searching...</p>
                        )}

                        {!loadingCustomers && customerResults.length === 0 && (
                          <ComboboxEmpty>No customers found</ComboboxEmpty>
                        )}

                        {customerResults.map((customer) => (
                          <ComboboxItem key={customer.id} value={customer.id}>
                            {customer.customer_name}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* STREET */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* CITY */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* DELIVERY DATE */}
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* NOTES */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Your Cart</h1>

          {error && (
            <Alert>
              <AlertCircle />
              <AlertTitle>Cart Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {cart.map((item) => (
            <CheckoutItemCard
              key={item.cart_id}
              item={item}
              onIncrease={() => increaseQuantity(item.cart_id)}
              onDecrease={() => decreaseQuantity(item.cart_id)}
              onRemove={() => removeFromCart(item.cart_id)}
            />
          ))}

          <Separator />

          <footer className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-amber-600 text-white hover:bg-amber-700"
              size="sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Submit Order"}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={back}
                size="sm"
              >
                Back
              </Button>

              <div className="flex-1">
                <CustomAlertDialog
                  buttonText="Clear Cart"
                  handler={clearCartAndBack}
                />
              </div>
            </div>
          </footer>
        </div>
      </form>
    </Form>
  );
}
