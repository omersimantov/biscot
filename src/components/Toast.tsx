import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import { useState } from "react";

export const Toast = ({ action }: { action: () => void }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(true);

  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={cx(
          "fixed bottom-4 left-4 w-60 rounded-xl text-sm text-white",
          "bg-neutral-900 border border-border",
          "radix-state-open:animate-toast-slide-in-bottom radix-state-open:animate-toast-slide-in-right",
          "radix-state-closed:animate-toast-hide",
          "radix-swipe-end:animate-toast-swipe-out",
          "translate-x-radix-toast-swipe-move-x",
          "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]"
        )}>
        <div className="flex items-center justify-between p-4">
          <ToastPrimitive.Title className="font-normal">Removed</ToastPrimitive.Title>
          <ToastPrimitive.Action altText="Undo" className="font-bold" onClick={action}>
            Undo
          </ToastPrimitive.Action>
        </div>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};
