"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function ConfirmLogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="animate-in zoom-in duration-300">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span>👋</span> Desconectar?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Você será desconectado da sua conta.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 justify-end mt-4">
          <AlertDialogCancel className="transition-all hover:scale-105">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onConfirm();
              // onOpenChange will be handled by parent if needed
            }}
            className="transition-all hover:scale-105"
          >
            Desconectar
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
