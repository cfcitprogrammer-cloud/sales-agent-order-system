"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerInfo } from "@/db/types/customer-info";

interface CustomerInfoFormProps {
  onBack: () => void;
  onConfirm: (info: CustomerInfo) => void;
}

export default function CustomerInfoForm({
  onBack,
  onConfirm,
}: CustomerInfoFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = () => {
    if (!name || !phone || !address) {
      alert("Please fill in all fields");
      return;
    }
    onConfirm({ name, phone, address });
  };

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[80vh] px-4 py-2">
      <h2 className="text-lg font-semibold">Customer Information</h2>

      <div className="flex flex-col gap-2">
        <Label>Full Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Phone Number</Label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0912-345-6789"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Delivery Address</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="123 Street, City"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button className="flex-1" onClick={handleSubmit}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
