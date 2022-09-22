import { Bars3BottomLeftIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Toast } from "./Toast";

export type Card = {
  id: string;
  title: string;
  description?: string;
  listId: string;
};

export const Card = ({ id, title, description, listId }: Card): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);

  const remove = async (): Promise<void> => {
    setShow(false);
    await fetch("/api/card", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
  };

  const undo = async (): Promise<void> => {
    setShow(true);
    await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, listId })
    });
  };

  return show ? (
    <div className="border w-72 rounded-xl border-border cursor-pointer bg-neutral-800 p-4 font-medium hover:border-[#777777] items-center flex justify-between space-x-4 mb-3">
      <div>{title}</div>
      <div className="flex space-x-4 items-center min-w-fit">
        {description && <Bars3BottomLeftIcon className="w-5" />}
        <MinusCircleIcon className="w-5 text-neutral-500 hover:text-white" onClick={remove} />
      </div>
    </div>
  ) : (
    /* Empty div so that it animates on removal & undo */
    <div>
      <Toast action={undo} />
    </div>
  );
};
