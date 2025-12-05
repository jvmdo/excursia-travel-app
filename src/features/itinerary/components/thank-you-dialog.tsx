import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactElement } from "react";

function ThankYouDialog({ children }: { children: ReactElement }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl flex flex-col items-center gap-3">
            <span className="text-5xl animate-bounce">🎉</span>
            Obrigado por usar nosso app!
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Esperamos que seu roteiro seja incrível e sua viagem inesquecível!
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ThankYouDialog;
