import { Bars3BottomLeftIcon, MinusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Toast from "./Toast";

export type Card = {
  title: string;
  description?: string;
};

export const Card = ({ title, description }: Card): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);

  const remove = (): void => {
    setShow(false);
  };

  const undo = (): void => {
    setShow(true);
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
