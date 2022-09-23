import { Bars3BottomLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { Toast } from "./Toast";

export type Card = {
  id: string;
  index: number;
  title: string;
  description?: string;
  listId: string;
};

export const Card = (card: Card): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string>(card.description ?? "");

  const remove = async (): Promise<void> => {
    setShow(false);
    const { id } = card;
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
      body: JSON.stringify(card)
    });
  };

  const updateCard = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setEditMode(false);
    setTitle(title.trim());
    setDescription(description.trim());
    if (title === "") setTitle(card.title);
    const { id } = card;
    await fetch("/api/card", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, description })
    });
  };

  const openCardModal = (): void => {
    // TODO: Handle
  };

  return show ? (
    <div className="border w-72 rounded-lg border-border cursor-pointer bg-neutral-800 p-3 font-medium hover:border-[#777777] items-center flex justify-between space-x-3 mb-3 text-sm">
      {editMode ? (
        <form onBlur={updateCard} onSubmit={updateCard} className="w-full">
          <textarea
            value={title}
            onChange={(e): void => setTitle(e.target.value)}
            autoFocus
            className="whitespace-nowrap"
          />
        </form>
      ) : (
        <div>{title}</div>
      )}
      <div className="flex space-x-3 items-center min-w-fit">
        {description && (
          <Bars3BottomLeftIcon className="w-[1.35rem] text-neutral-500 hover:text-white" onClick={openCardModal} />
        )}
        {editMode ? (
          <TrashIcon className="w-5 h-fit text-neutral-500 hover:text-white right-0" onClick={remove} />
        ) : (
          <PencilIcon className="w-4 text-neutral-500 hover:text-white" onClick={(): void => setEditMode(true)} />
        )}
      </div>
    </div>
  ) : (
    /* Empty div so that it animates on removal & undo */
    <div>
      <Toast action={undo} />
    </div>
  );
};
