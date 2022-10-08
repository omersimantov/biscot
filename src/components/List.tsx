import { Card } from "@/components/Card";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { List as TList } from "@/lib/prisma/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Card as TCard } from "@prisma/client";
import cuid from "cuid";
import { FormEvent, useRef, useState } from "react";
import { undoToast } from "src/pages";

export const List = (list: TList): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);
  const [cards, setCards] = useState<TCard[]>(list.cards);
  const endRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(list.title);

  useClickOutside((e: FormEvent<Element>): void => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setEditMode(false);
      updateList();
    }
  });

  const remove = async (): Promise<void> => {
    setShow(false);
    const { id } = list;
    undoToast(id, undo);
    await fetch(`/api/lists/${list.id}`, { method: "DELETE" });
  };

  // FIXME: Cards array is static, doesn't get updated when cards get updated in state
  const undo = async (): Promise<void> => {
    setShow(true);
    setEditMode(false);
    await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...list, title, cards })
    });
  };

  const updateList = async (): Promise<void> => {
    setEditMode(false);
    await fetch(`/api/lists/${list.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...list, title, cards })
    });
  };

  const addCard = async (): Promise<void> => {
    const lastIndex = cards[cards.length - 1]?.index;
    const newCard = {
      id: cuid(),
      createdAt: new Date(),
      index: lastIndex ? lastIndex + 1024 : 65535,
      title: "New Card",
      description: "",
      listId: list.id
    };
    setCards([...cards, newCard]);
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => {
      endRef.current && endRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    });
    await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard)
    });
  };

  return show ? (
    <div className="px-10 group min-w-fit overscroll-y-none border-r border-neutral-700">
      <div
        className="h-14 text-lg font-bold w-72 cursor-pointer"
        onClick={(e): void => {
          if (!editMode) {
            e.stopPropagation();
            setEditMode(true);
          }
        }}>
        <div className="flex justify-between items-center">
          {editMode ? (
            <form onSubmit={updateList} ref={formRef}>
              <input
                type="text"
                value={title}
                className="border-0 bg-bg text-lg rounded-none"
                onChange={(e): void => setTitle(e.target.value)}
                autoFocus
              />
            </form>
          ) : (
            <h1 className="text-lg font-bold w-full">{title}</h1>
          )}
          <div className="min-w-fit">
            {editMode ? (
              <TrashIcon
                className="w-[1.35rem] h-full text-neutral-500 hover:text-white"
                strokeWidth={1}
                onClick={(e): void => {
                  e.stopPropagation();
                  remove();
                }}
              />
            ) : (
              <PencilIcon
                className="w-[1.2rem] min-h-full text-neutral-500 hover:text-white ml-3 group-hover:visible invisible"
                strokeWidth={1}
                onClick={(e): void => {
                  e.stopPropagation();
                  setEditMode(true);
                }}
              />
            )}
          </div>
        </div>
      </div>
      {cards.map((card: TCard) => (
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
