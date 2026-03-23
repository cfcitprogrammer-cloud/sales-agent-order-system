import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { useDropzone } from "react-dropzone";

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
import { AlertCircle, X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

type CheckoutFormProps = {
  onSubmit: (
    values: CheckoutFormValues & { attachments?: string[] },
  ) => Promise<boolean>;
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

  // 🔥 attachment state
  const [files, setFiles] = useState<File[]>([]);

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
      attachments: [],
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

      if (!error) setCustomerResults(data || []);

      setLoadingCustomers(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [customerQuery]);

  // 🔥 DROPZONE
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: File[] = [];

    acceptedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB limit`);
        return;
      }
      validFiles.push(file);
    });

    setFiles((prev) => [...prev, ...validFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

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
            let uploadedUrls: string[] = [];

            // 🔥 upload all files
            for (const file of files) {
              const fileName = `${Date.now()}-${file.name}`;

              const { error: uploadError } = await supabase.storage
                .from("attachments")
                .upload(fileName, file);

              if (uploadError) {
                toast.error(`Failed: ${file.name}`);
                return;
              }

              const { data: publicUrlData } = supabase.storage
                .from("attachments")
                .getPublicUrl(fileName);

              uploadedUrls.push(publicUrlData.publicUrl);
            }

            console.log("Uploaded URLs:", uploadedUrls);

            const isSuccess = await onSubmit({
              ...data,
              attachments: uploadedUrls,
            });

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

          {/* CUSTOMER SEARCH */}
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

                      if (selected) {
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

          {/* 🔥 ATTACHMENTS */}
          <div>
            <FormLabel>Attachments</FormLabel>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                isDragActive ? "bg-amber-100" : ""
              }`}
            >
              <input {...getInputProps()} />
              <p className="text-sm">
                Drag & drop files here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                (PDF, JPG, PNG • Max 5MB each)
              </p>
            </div>

            {/* Preview */}
            <div className="mt-2 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs">📄</span>
                    )}
                    <span className="text-sm">{file.name}</span>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
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
