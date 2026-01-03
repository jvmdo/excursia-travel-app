import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ComponentProps, ReactElement } from "react";

interface ThankYouDialogProps extends ComponentProps<typeof Dialog> {
  children: ReactElement;
}

function ThankYouDialog({ children, open, onOpenChange }: ThankYouDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex flex-col items-center gap-3">
            <span className="text-5xl animate-bounce">🎉</span>
            Obrigado por usar nosso app!
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center text-base pt-2">
          Esperamos que seu roteiro seja incrível e sua viagem inesquecível!
        </DialogDescription>
        <DialogFooter className="text-center text-sm bg-muted">
          Seu roteiro está sendo gerado ⚙️
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ThankYouDialog;
