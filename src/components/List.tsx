import { Toast } from "@/components/Toast";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Card } from "./Card";

export type List = {
  id: string;
  index: number;
  title: string;
  userId: string;
  cards: Card[];
};

export const List = ({ id, index, title, cards, userId }: List): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);

  const remove = async (): Promise<void> => {
    setShow(false);
    await fetch("/api/list", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
  };

  const undo = async (): Promise<void> => {
    setShow(true);
    await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, index, title, userId })
    });
  };

  return show ? (
    <div className="px-10 group h-full min-w-fit">
      <div className="flex items-center justify-between mb-5 cursor-pointer">
        <h1 className="text-lg font-bold">{title}</h1>
        <EllipsisHorizontalIcon
          className="w-7 text-neutral-500 hover:text-white ml-4 group-hover:block hidden"
          onClick={remove}
        />
      </div>
      <div>
        {cards.map((card) => (
          <Card key={card.id} id={card.id} listId={card.listId} title={card.title} description={card.description} />
        ))}
        <div className="hover:bg-neutral-800 rounded-xl p-4 text-center font-medium cursor-pointer min-w-full w-72">
          + Add
        </div>
      </div>
    </div>
  ) : (
    /* Empty div so that it animates on removal & undo */
    <div>
      <Toast action={undo} />
    </div>
  );
};
