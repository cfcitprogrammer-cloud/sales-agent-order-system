"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import type { Province, City } from "@/db/types/places";
import rawProvincesData from "@/db/data/provinces.json";
import rawCitiesData from "@/db/data/cities.json";

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
  const provinces: Province[] = rawProvincesData as Province[];
  const cities: City[] = rawCitiesData as City[];

  const {
    cart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      contactNumber: "",
      email: "",
      address: "",
      province: "",
      city: "",
      deliveryDate: "",
      notes: "",
      cart,
    },
  });

  const selectedProvinceName = form.watch("province");

  useEffect(() => {
    form.setValue("city", "");
  }, [selectedProvinceName, form]);

  useEffect(() => {
    form.setValue("cart", cart);
  }, [cart, form]);

  const selectedProvinceKey = provinces.find(
    (p) => p.name === selectedProvinceName,
  )?.key;

  const filteredCities = cities.filter(
    (c) => c.province === selectedProvinceKey,
  );

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.cart_qty,
    0,
  );

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
              form.reset();
              navigate("/products/1", { replace: true });
              toast.success("Order placed successfully");
            } else {
              toast.error("Failed to place order. Please try again.");
            }
          },
          (errors) => {
            console.log(errors);
            if (errors.cart) setError(errors.cart.message || "");
            toast.error("Failed to place order. Please try again.");
          },
        )}
        className="grid grid-cols-2 gap-4"
      >
        {/* Left: Customer info */}
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Province & City */}
          <div className="flex gap-2">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Combobox
                        items={provinces.map((p) => p.name)}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <ComboboxInput
                          placeholder="Select a province"
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No province found</ComboboxEmpty>
                          <ComboboxList>
                            {provinces.map((p) => (
                              <ComboboxItem key={p.key} value={p.name}>
                                {p.name}
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
            </div>

            <div className="flex-1">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Combobox
                        items={filteredCities.map((c) => c.name)}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedProvinceName}
                      >
                        <ComboboxInput
                          placeholder={
                            selectedProvinceName
                              ? "Select a city"
                              : "Select a province first"
                          }
                          showClear
                        />
                        <ComboboxContent>
                          <ComboboxEmpty>No city found</ComboboxEmpty>
                          <ComboboxList>
                            {filteredCities.map((city) => (
                              <ComboboxItem key={city.name} value={city.name}>
                                {city.name}
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
            </div>
          </div>

          {/* Delivery Date & Time */}
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="deliveryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right: Cart */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Your Cart</h1>

          {error && (
            <Alert>
              <AlertCircle />
              <AlertTitle>Cart Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {cart.map((item) => (
              <CheckoutItemCard
                key={item.cart_id}
                item={item}
                onIncrease={() => increaseQuantity(item.cart_id)}
                onDecrease={() => decreaseQuantity(item.cart_id)}
                onRemove={() => removeFromCart(item.cart_id)}
              />
            ))}
          </div>

          <Separator />

          {/* <div className="flex items-center justify-between gap-1">
            <p className="text-md font-semibold">Amount total</p>
            <p className="text-sm">₱{totalAmount}</p>
          </div> */}

          <footer className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              size="sm"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Submit Order"}
            </Button>

            <div className="flex flex-wrap gap-2">
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
