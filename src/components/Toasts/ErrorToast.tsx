import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const errorToast = (): void => {
  toast.custom(
    <div className="rounded-lg p-4 border border-red bg-neutral-900">
      <ExclamationCircleIcon className="w-5 text-red" strokeWidth={2} />
    </div>,
    {
      position: "bottom-left",
      duration: 10000
    }
  );
};
