import { Card } from "@/components/Card";
import { errorToast } from "@/components/Toasts/ErrorToast";
import { undoToast } from "@/components/Toasts/UndoToast";
import { List as TList } from "@/lib/prisma/client";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Card as TCard } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cuid from "cuid";
import { useRef, useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";

export const List = (list: TList): JSX.Element => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState<string>(list.title);
  const [editMode, setEditMode] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { setNodeRef, listeners, transition, transform, isDragging } = useSortable({
    id: list.index,
    transition: {
      duration: 100,
      easing: "ease"
    }
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  const { data } = useQuery<TList>(
    [list.id],
    async (): Promise<TList> => {
      const res = await fetch(`/api/lists/${list.id}`);
      const data = await res.json();
      return data;
    },
    {
      initialData: list
    }
  );

  const updateTitleMutation = useMutation(
    async () =>
      await fetch(`/api/lists/${list.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, title })
      }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries([list.id]);
        const previousList = queryClient.getQueryData([list.id]);
        queryClient.setQueryData<TList>([list.id], (old) => {
          const updatedList = { ...old!, title };
          return updatedList;
        });
        return { previousList };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newList, context) => {
        context && context.previousList && queryClient.setQueryData(["lists"], context.previousList);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries(["lists"]);
      }
    }
  );

  const updateTitle = async (): Promise<void> => {
    setTimeout(() => setEditMode(false));
    setTitle(title.trim());
    updateTitleMutation.mutate();
  };

  const removeListMutation = useMutation(() => fetch(`/api/lists/${list.id}`, { method: "DELETE" }), {
    onMutate: async () => {
      undoToast(list.id, undoRemoveList);
      await queryClient.cancelQueries(["lists"]);
      const previousLists = queryClient.getQueryData(["lists"]);
      queryClient.setQueryData<TList[] | undefined>(["lists"], (old) => {
        const lists = old!.slice();
        const index = lists.findIndex((item) => item.id === list.id);
        lists.splice(index, 1);
        return lists;
      });
      return { previousLists };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newList, context) => {
      context && context.previousLists && queryClient.setQueryData(["lists"], context.previousLists);
      errorToast();
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.isMutating() === 1 && queryClient.invalidateQueries(["lists"]);
    }
  });

  const undoRemoveListMutation = useMutation(
    async (newList: TList): Promise<TList> => {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList)
      });
      return await res.json();
    },
    {
      onMutate: async () => {
        await queryClient.cancelQueries(["lists"]);
        const previousListsArray = queryClient.getQueryData(["lists"]);
        queryClient.setQueryData<TList[] | undefined>(["lists"], (old) => {
          const lists = old!.slice();
          const index = lists.indexOf(data!);
          lists.splice(index, 0, data!);
          return lists;
        });
        return { previousListsArray };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newListsArray, context) => {
        context && context.previousListsArray && queryClient.setQueryData(["lists"], context.previousListsArray);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries(["lists"]);
      }
    }
  );

  const undoRemoveList = async (): Promise<void> => {
    setEditMode(false);
    undoRemoveListMutation.mutate(data!);
  };

  const addCardMutation = useMutation(
    async (newCard: TCard): Promise<TList> => {
      const res = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCard)
      });
      return await res.json();
    },
    {
      onMutate: async (newCard) => {
        await queryClient.cancelQueries([list.id]);
        const previousList = queryClient.getQueryData([list.id]);
        queryClient.setQueryData<TList>([list.id], (old) => ({
          ...old!,
          cards: [...old!.cards, newCard]
        }));
        return { previousList };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newCard, context) => {
        // FIXME: onError is not being called
        queryClient.setQueryData([list.id], context?.previousList);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries([list.id]);
      }
    }
  );

  const addCard = async (): Promise<void> => {
    const lastIndex = data!.cards[data!.cards.length - 1]?.index;
    const newCard = {
      id: cuid(),
      createdAt: new Date(),
      index: lastIndex ? lastIndex + 1024 : 102400,
      title: "New Card",
      description: "",
      listId: list.id
    };
    addCardMutation.mutate(newCard);
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => endRef.current && endRef.current.scrollIntoView({ block: "end", behavior: "smooth" }));
  };

  const updateCardsArrayMutation = useMutation(
    async (newCardsArray: TCard[]): Promise<TCard[]> => {
      const res = await fetch(`/api/lists/${list.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, cards: newCardsArray })
      });
      return await res.json();
    },
    {
      onMutate: async (newCardsArray) => {
        await queryClient.cancelQueries([list.id]);
        const previousCardsArray = queryClient.getQueryData([list.id]);
        queryClient.setQueryData<TCard[]>([list.id], (old) => {
          return { ...old!, cards: newCardsArray };
        });
        return { previousCardsArray };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newList, context) => {
        context && context.previousCardsArray && queryClient.setQueryData([list.id], context.previousCardsArray);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries([list.id]);
      }
    }
  );

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  ];

  const handleDragEnd = async ({ active, over }: DragEndEvent): Promise<TCard[] | void> => {
    if (data && data.cards && over && active.id !== over.id) {
      const activePos = data.cards.findIndex((item) => item.index === active.id);
      const overPos = data.cards.findIndex((item) => item.index === over.id);

      let newIndex: number;

      if (overPos === 0) newIndex = data.cards[overPos]!.index - 1024;
      else if (overPos === data.cards.length - 1) newIndex = data.cards[overPos]!.index + 1024;
      else newIndex = (data.cards[overPos]!.index + data.cards[overPos - 1]!.index) / 2;

      data.cards[activePos]!.index = newIndex;

      const newCardsArray = arrayMove(data.cards, activePos, overPos);

      updateCardsArrayMutation.mutate(newCardsArray);
    }
  };

  return (
    <div
      className="px-10 group min-w-fit overscroll-y-none border-r border-neutral-700"
      ref={setNodeRef}
      style={dragStyle}>
      <div className={isDragging ? "opacity-50" : "!overflow-auto"}>
        <div
          {...listeners}
          className="h-14 text-lg font-bold w-72 cursor-pointer"
          onContextMenu={(): void => setEditMode(true)}
          onClick={(e): void => {
            if (!editMode) {
              e.stopPropagation();
              setEditMode(true);
            }
          }}>
          <div className="flex justify-between items-center space-x-5">
            {editMode ? (
              <OutsideClickHandler onOutsideClick={updateTitle}>
                <form
                  onSubmit={(e): void => {
                    e.preventDefault();
                    updateTitle();
                  }}
                  className="w-full">
                  <input
                    type="text"
                    value={title}
                    className="text-lg rounded-none"
                    onChange={(e): void => setTitle(e.target.value)}
                    autoFocus
                  />
                </form>
              </OutsideClickHandler>
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
                    removeListMutation.mutate();
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
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={data!.cards.map((card) => card.index)}>
            {data!.cards.map((card: TCard) => (
              <Card key={card.id} {...card} />
            ))}
            <DragOverlay dropAnimation={{ duration: 0 }} />
          </SortableContext>
        </DndContext>
        <div
          ref={endRef}
          className="hover:bg-neutral-800 rounded-lg p-3 text-center font-medium cursor-pointer min-w-full w-72 px-10 text-sm"
          onClick={addCard}>
          + Add
        </div>
      </div>
    </div>
  );
};
