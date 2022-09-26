import { Toast } from "@/components/Toast";
import { List as TList } from "@/lib/prisma/client";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import type { Card as TCard } from "@prisma/client";
import cuid from "cuid";
import { useRef, useState } from "react";
import { Card } from "./Card";

export const List = (list: TList): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);
  const [cards, setCards] = useState<TCard[]>(list.cards);
  const endRef = useRef<HTMLDivElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(list.title);

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

  const updateTitle = async (): Promise<void> => {
    setEditMode(false);
    await fetch("/api/list", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: list.id, title })
    });
  };

  const addCard = async (): Promise<void> => {
    const id = cuid();
    const newCard = {
      id,
      createdAt: new Date(),
      index: cards.length,
      title: "New Card",
      description: "",
      listId: list.id
    };
    setCards([...cards, newCard]);
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => {
      endRef.current && endRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    });
    await fetch("/api/card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard)
    });
  };

  return show ? (
    <div className="px-10 group min-w-fit !overflow-auto overscroll-y-none border-0">
      <div className="bg-bg h-14 text-lg font-bold w-72">
        <div className="flex justify-between cursor-pointer items-center">
          {editMode ? (
            <form onBlur={updateTitle} onSubmit={updateTitle}>
              <input
                type="text"
                value={title}
                className="border-0 bg-bg text-lg rounded-none"
                onChange={(e): void => setTitle(e.target.value)}
                autoFocus
              />
            </form>
          ) : (
            <h1 className="text-lg font-bold w-full" onClick={(): void => setEditMode(true)}>
              {title}
            </h1>
          )}
          <div className="min-w-fit">
            <EllipsisHorizontalIcon
              className="w-7 min-h-full text-neutral-500 hover:text-white ml-3 group-hover:visible invisible"
              strokeWidth={1}
              onClick={remove}
            />
          </div>
        </div>
      </div>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
      <div
        ref={endRef}
        className="hover:bg-neutral-800 rounded-lg p-3 text-center font-medium cursor-pointer min-w-full w-72 px-10 text-sm"
        onClick={addCard}>
        + Add
      </div>
    </div>
  ) : (
    <Toast action={undo} />
  );
};
