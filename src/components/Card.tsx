import { Modal } from "@/components/Modal";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { getFormattedDate } from "@/lib/utils/getFormattedDate";
import { Bars3BottomLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Card as TCard } from "@prisma/client";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { undoToast } from "src/pages";

export const Card = (card: TCard): JSX.Element => {
  const [show, setShow] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string>(card.description ?? "");
  const formRef = useRef<HTMLFormElement>(null);

  useClickOutside((e: FormEvent<Element>): void => {
    if (formRef.current && !formRef.current.contains(e.target as Node)) {
      setEditMode(false);
      updateCard(e);
    }
  });

  const remove = async (): Promise<void> => {
    setShow(false);
    const { id } = card;
    undoToast(id, undo);
    await fetch(`/api/cards/${card.id}`, { method: "DELETE" });
  };

  const undo = async (): Promise<void> => {
    setShow(true);
    await fetch("/api/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card)
    });
  };

  const updateCard = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setEditMode(false);
    setTitle(title.trim());
    if (title === "") setTitle(card.title);
    await fetch(`/api/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...card, title, description })
    });
  };

  const toggleModal = (e: FormEvent): void => {
    if (!editMode) {
      setModalOpen((modalOpen) => !modalOpen);
      modalOpen && updateCard(e);
    }
  };

  // Ctrl/Cmd + S to save
  const keyPress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        toggleModal(e);
      }
    },
    [toggleModal]
  );

  useEffect(() => {
    modalOpen && document.addEventListener("keydown", keyPress);
    return (): void => {
      document.removeEventListener("keydown", keyPress);
    };
  }, [keyPress]);

  const modalContent = (
    <div className="w-full">
      <form className="space-y-3" onSubmit={updateCard} ref={formRef}>
        <input
          placeholder="Title"
          value={title}
          type="text"
          className="p-4 font-bold text-base"
          onChange={(v): void => setTitle(v.target.value)}
          onKeyPress={(e): false | void => {
            if (e.key === "Enter") toggleModal(e);
          }}
        />
        <textarea
          placeholder="Description"
          className="p-4"
          value={description}
          rows={10}
          autoFocus
          onChange={(v): void => setDescription(v.target.value)}
          onFocus={(v): void => {
            const val = v.target.value;
            v.target.value = "";
            v.target.value = val;
          }}
        />
      </form>
      <div className="flex items-end justify-between h-14">
        <div className="text-sm font-medium">Created {getFormattedDate(card.createdAt)}</div>
        <TrashIcon
          className="w-6 text-neutral-500 hover:text-white cursor-pointer ml-3"
          strokeWidth={1}
          onClick={(e): void => {
            toggleModal(e);
            remove();
          }}
        />
      </div>
    </div>
  );

  return show ? (
    <>
      <div
        className="border w-72 rounded-lg cursor-pointer bg-neutral-800 p-3 
        font-medium hover:border-light items-center flex justify-between space-x-3 mb-3 text-sm"
        onClick={(e): false | void => !editMode && toggleModal(e)}
        onContextMenu={(): void => setEditMode(true)}>
        {editMode ? (
          <form onSubmit={updateCard} className="w-full" ref={formRef}>
            <input
              type="text"
              value={title}
              className="border-0 p-0 leading-[1rem] rounded-none max-h-min m-0"
              onChange={(e): void => setTitle(e.target.value)}
              onFocus={(v): void => {
                const val = v.target.value;
                v.target.value = "";
                v.target.value = val;
              }}
              onKeyPress={(e): false | void => {
                if (e.key === "Enter") updateCard(e);
              }}
              autoFocus
            />
          </form>
        ) : (
          <div>{title}</div>
        )}
        <div className="flex space-x-3 items-center min-w-fit">
          {description && (
            <Bars3BottomLeftIcon
              className="w-[1.35rem] text-white pointer-events-none"
              strokeWidth={1}
              onClick={toggleModal}
            />
          )}
          {editMode ? (
            <TrashIcon
              className="w-5 h-full text-neutral-500 hover:text-white"
              strokeWidth={1}
              onClick={(e): void => {
                e.stopPropagation();
                remove();
              }}
            />
          ) : (
            <PencilIcon
              className="w-[1.1rem] text-neutral-500 hover:text-white"
              strokeWidth={1}
              onClick={(e): void => {
                e.stopPropagation();
                setEditMode(true);
              }}
            />
          )}
        </div>
      </div>
      {modalOpen && <Modal toggle={toggleModal} content={modalContent} />}
    </>
  ) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <></>
  );
};
