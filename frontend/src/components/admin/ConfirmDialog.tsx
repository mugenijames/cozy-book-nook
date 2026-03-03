// src/components/admin/ConfirmDialog.tsx
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

interface ConfirmDialogProps {
  trigger?: React.ReactNode;                  // Optional: custom trigger button/text
  title?: string;                             // Default: "Are you absolutely sure?"
  description?: string;                       // Default: "This action cannot be undone."
  confirmText?: string;                       // Default: "Delete"
  cancelText?: string;                        // Default: "Cancel"
  variant?: "default" | "destructive";        // Button style for confirm
  onConfirm: () => void | Promise<void>;      // What happens when confirmed
  children?: React.ReactNode;                 // If no trigger, use children as trigger
}

export default function ConfirmDialog({
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "destructive",
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || children || (
          <Button variant="outline" size="sm">
            Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            variant={variant}
            onClick={async (e) => {
              e.preventDefault(); // prevent immediate close
              try {
                await onConfirm();
              } catch (err) {
                console.error("Confirmation action failed:", err);
              }
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}