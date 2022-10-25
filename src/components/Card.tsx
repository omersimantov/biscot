import { Modal } from "@/components/Modal";
import { errorToast } from "@/components/Toasts/ErrorToast";
import { undoToast } from "@/components/Toasts/UndoToast";
import { List } from "@/lib/prisma/client";
import { getFormattedDate } from "@/lib/utils/getFormattedDate";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Bars3BottomLeftIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Card as TCard } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

export const Card = (card: TCard): JSX.Element => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState<string>(card.title);
  const [description, setDescription] = useState<string | null>(card.description);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { setNodeRef, listeners, transition, transform, isDragging } = useSortable({
    id: card.index,
    transition: {
      duration: 100,
      easing: "ease"
    }
  });

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const { data } = useQuery<TCard>(
    [card.id],
    async (): Promise<TCard> => {
      const res = await fetch(`/api/cards/${card.id}`);
      const data = await res.json();
      return data;
    },
    {
      initialData: card
    }
  );

  const toggleModal = (): void => {
    setModalOpen((modalOpen) => !modalOpen);
    modalOpen && updateCard();
  };

  // Ctrl/Cmd + S to save
  const keyPress = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => {
      if (e.key === "s" && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        toggleModal();
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

  const updateCard = async (): Promise<void> => {
    setTimeout(() => setEditMode(false));
    setTitle(title.trim());
    await fetch(`/api/cards/${card.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...card, title, description })
    });
  };

  const removeCardMutation = useMutation(async () => await fetch(`/api/cards/${card.id}`, { method: "DELETE" }), {
    onMutate: async () => {
      undoToast(card.id, undoRemoveCard);
      await queryClient.cancelQueries([card.listId]);
      const previousList = queryClient.getQueryData([card.listId]);
      queryClient.setQueryData<List | undefined>([card.listId], (old) => {
        const cards = old!.cards.slice();
        const index = cards.findIndex((item) => item.id === card.id);
        cards.splice(index, 1);
        return { ...old!, cards };
      });
      return { previousList };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newList, context) => {
      context && context.previousList && queryClient.setQueryData([card.listId], context.previousList);
      errorToast();
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.isMutating() === 1 && queryClient.invalidateQueries([card.listId]);
    }
  });

  const undoRemoveCardMutation = useMutation(
    async (newCard: TCard): Promise<TCard> => {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
      });
      return await res.json();
    },
    {
      onMutate: async (newCard) => {
        await queryClient.cancelQueries([card.listId]);
        const previousList = queryClient.getQueryData([card.listId]);
        queryClient.setQueryData<List>([card.listId], (old) => ({
          ...old!,
          cards: [...old!.cards, newCard]
        }));
        return { previousList };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newCard, context) => {
        context && context.previousList && queryClient.setQueryData([card.listId], context.previousList);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries([card.listId]);
      }
    }
  );

  const undoRemoveCard = (): void => {
    setEditMode(false);
    undoRemoveCardMutation.mutate(data);
  };

  const modalContent = (
    <div className="w-full">
      <form
        onSubmit={(e): void => {
          e.preventDefault();
          updateCard();
        }}
        className="space-y-3">
        <input
          placeholder="Title"
          value={title}
          type="text"
          className="p-4 font-bold text-base border border-border focus:border-light hover:border-light"
          onChange={(v): void => setTitle(v.target.value)}
          onKeyPress={(e): false | void => {
            if (e.key === "Enter") {
              e.preventDefault();
              toggleModal();
            }
          }}
        />
        <textarea
          placeholder="Description"
          className="p-4 border-border border focus:border-light hover:border-light"
          value={description ?? ""}
          rows={15}
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
        <div className="text-sm font-medium">Created {data && getFormattedDate(data.createdAt)}</div>
        <TrashIcon
          className="w-6 text-neutral-500 hover:text-white cursor-pointer ml-3"
          strokeWidth={1}
          onClick={(): void => {
            toggleModal();
            removeCardMutation.mutate();
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={setNodeRef}
        style={dragStyle}
        {...listeners}
        className="border w-72 rounded-lg cursor-pointer bg-neutral-800 px-3
        font-medium hover:border-light items-center flex justify-between space-x-3 mb-3 text-sm min-h-[3rem]"
        onClick={toggleModal}
        onContextMenu={(): void => setEditMode(true)}>
        {editMode ? (
          <OutsideClickHandler onOutsideClick={updateCard}>
            <form
              onSubmit={(e): void => {
                e.preventDefault();
                updateCard();
              }}
              className="w-full">
              <input
                type="text"
                value={title}
                className="leading-[1rem] rounded-none max-h-min w-full"
                onClick={(e): void => e.stopPropagation()}
                onChange={(e): void => setTitle(e.target.value)}
                onFocus={(v): void => {
                  const val = v.target.value;
                  v.target.value = "";
                  v.target.value = val;
                }}
                onKeyPress={(e): false | void => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    updateCard();
                  }
                }}
                autoFocus
              />
            </form>
          </OutsideClickHandler>
        ) : (
          <div>{title}</div>
        )}
        <div className="flex space-x-3 items-center min-w-fit">
          {description && (
            <Bars3BottomLeftIcon
              className="w-[1.35rem] text-white pointer-events-none"
              strokeWidth={1.4}
              onClick={toggleModal}
            />
          )}
          {editMode ? (
            <TrashIcon
              className="w-5 h-full text-neutral-500 hover:text-white"
              strokeWidth={1}
              onClick={(e): void => {
                e.stopPropagation();
                removeCardMutation.mutate();
              }}
            />
          ) : (
            <PencilIcon
              className="w-[1.15rem] text-neutral-500 hover:text-white"
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
  );
};
