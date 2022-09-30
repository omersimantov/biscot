import { XMarkIcon } from "@heroicons/react/24/outline";
import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import { useState } from "react";

export const Toast = ({ action }: { action: () => void }): JSX.Element => {
  const [open, setOpen] = useState<boolean>(true);

  return open ? (
    <div className="!border-0">
      <ToastPrimitive.Provider>
        <ToastPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          className={cx(
            "fixed bottom-6 left-6 w-72 rounded-lg text-sm text-white",
            "bg-neutral-900 border border-border",
            "radix-state-open:animate-toast-slide-in-bottom radix-state-open:animate-toast-slide-in-right",
            "radix-state-closed:animate-toast-hide",
            "radix-swipe-end:animate-toast-swipe-out",
            "translate-x-radix-toast-swipe-move-x",
            "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]"
          )}>
          <div className="flex items-center justify-between px-4 h-14">
            <ToastPrimitive.Title className="font-medium">Removed</ToastPrimitive.Title>
            <div className="flex items-center space-x-1">
              <ToastPrimitive.Action
                altText="Undo"
                className="font-bold hover:bg-neutral-800 rounded-lg px-4 py-2"
                onClick={action}>
                Undo
              </ToastPrimitive.Action>
              <XMarkIcon
                className="w-5 cursor-pointer text-neutral-500 hover:text-white"
                onClick={(): void => setOpen(false)}
              />
            </div>
          </div>
        </ToastPrimitive.Root>
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>
    </div>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
