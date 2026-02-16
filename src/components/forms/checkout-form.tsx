"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import CheckoutItemCard2 from "../custom/checkout-item-card-2";
import CheckoutItemCard from "../custom/checkout-item-card";
import { useNavigate } from "react-router-dom";
import CustomAlertDialog from "../custom/dialogs/alert-dialog";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Spinner } from "../ui/spinner";

type CheckoutFormProps = {
  onSubmit: (values: CheckoutFormValues) => Promise<boolean>;
};

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const provinces: Province[] = rawProvincesData as Province[];
  const cities: City[] = rawCitiesData as City[];

  const [error, setError] = useState("");

  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      storeName: "",
      customerName: "",
      contactPerson: "",
      address: "",
      province: "",
      city: "",
      deliveryDate: "",
      receivingTime: "",
      notes: "",
      cart,
    },
  });

  const selectedProvinceName = form.watch("province");

  // Reset city when province changes
  useEffect(() => {
    form.setValue("city", "");
  }, [selectedProvinceName, form]);

  // Map province name to key for city filtering
  const selectedProvinceKey = provinces.find(
    (p) => p.name === selectedProvinceName,
  )?.key;

  // Filter cities based on province key
  const filteredCities = cities.filter(
    (c) => c.province === selectedProvinceKey,
  );

  function clearCartAndBack() {
    clearCart();
    navigate("/", { replace: true });
  }

  function back() {
    navigate("/", { replace: true });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          async (data) => {
            const isSuccess = await onSubmit(data);

            if (isSuccess) {
              form.reset();
              navigate("/", { replace: true });
            }
          },
          (errors) => {
            if (errors.cart) {
              setError(errors.cart.message || "");
            }
          },
        )}
        className="grid grid-cols-2 gap-4"
      >
        <div className="space-y-4">
          {/* Store Name */}
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Customer Name */}
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

          {/* Contact Person */}
          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address */}
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

          <div className="flex gap-2">
            <div className="flex-1">
              {/* Province Combobox */}
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province</FormLabel>
                    <FormControl>
                      <Combobox
                        items={provinces.map((p) => p.name)} // store readable name
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
              {/* City Combobox */}
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

          {/* Delivery Date / Receiving Time */}
          <div className="grid grid-cols-2 gap-4">
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
            <FormField
              control={form.control}
              name="receivingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiving Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Notes */}
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

        <div className="space-y-2">
          <div>
            <h1 className="text-lg font-semibold">Your Cart</h1>
          </div>
          {error && (
            <Alert>
              <AlertCircle />
              <AlertTitle>Cart Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div>
            {cart.map((item) => (
              <CheckoutItemCard key={item.id} item={item} />
            ))}
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-1">
            <p className="text-md font-semibold">Amount total</p>
            <p className="text-sm">
              ₱{cart.reduce((acc, item) => acc + item.price * item.cart_qty, 0)}
            </p>
          </div>

          <footer className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              size={"sm"}
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "Submit Order"}
            </Button>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={"outline"}
                className="flex-1"
                onClick={back}
                size={"sm"}
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
