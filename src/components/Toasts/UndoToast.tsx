import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export const undoToast = (id: string, undo: () => void): void => {
  toast.custom(
    <div
      className="rounded-lg h-14 w-14 flex items-center justify-center hover:border-light border cursor-pointer bg-neutral-900"
      onClick={(): void => {
        undo();
        toast.remove(id);
      }}>
      <ArrowUturnLeftIcon className="w-4 text-white" strokeWidth={2} />
    </div>,
    {
      position: "bottom-left",
      duration: 10000,
      id
    }
  );
};
