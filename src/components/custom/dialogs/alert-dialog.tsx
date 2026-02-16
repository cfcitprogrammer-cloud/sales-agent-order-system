"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDialogProps {
  variant?: React.ComponentProps<typeof Button>["variant"];
  buttonText: string;
  dialogTitle?: string;
  dialogDescription?: string;
  cancelText?: string;
  actionText?: string;
  handler: () => void;
  icon?: React.ReactNode;
}

export default function CustomAlertDialog({
  variant = "outline",
  buttonText,
  dialogTitle = "Are you absolutely sure?",
  dialogDescription = "This action cannot be undone.",
  cancelText = "Cancel",
  actionText = "Continue",
  handler,
  icon,
}: CustomAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant={variant}
          className="flex items-center gap-2 w-full"
          type="button"
        >
          {icon}
          {buttonText}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handler}>{actionText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
