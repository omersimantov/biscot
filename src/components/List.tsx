import { Toast } from "@/components/Toast";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import cuid from "cuid";
import { useState } from "react";
import { Card } from "./Card";

export type List = {
  id: string;
  index: number;
  title: string;
  userId: string;
  cards: Card[];
};

export const List = (list: List): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);
  const [cards, setCards] = useState<Card[]>(list.cards);

  const remove = async (): Promise<void> => {
    setShow(false);
    const { id } = list;
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
      body: JSON.stringify(list)
    });
  };

  const addCard = async (): Promise<void> => {
    const id = cuid();
    const newCard = {
      id,
      index: cards.length,
      title: "New Card",
      listId: list.id
    };
    setCards([...cards, newCard]);
    await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard)
    });
  };

  return show ? (
    <div className="px-10 group min-h-full min-w-fit scrollbar-none">
      <div className="flex items-center justify-between mb-5 cursor-pointer">
        <h1 className="text-lg font-bold">{list.title}</h1>
        <EllipsisHorizontalIcon
          className="w-7 text-neutral-500 hover:text-white ml-4 group-hover:block hidden"
          onClick={remove}
        />
      </div>
      <div>
        {cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            index={card.index}
            listId={card.listId}
            title={card.title}
            description={card.description}
          />
        ))}
        <div
          className="hover:bg-neutral-800 rounded-xl p-4 text-center font-medium cursor-pointer min-w-full w-72 px-10 text-sm"
          onClick={addCard}>
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
