import { GoogleIcon } from "@/components/GoogleIcon";
import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import { errorToast } from "@/components/Toasts/ErrorToast";
import type { List as TList } from "@/lib/prisma/client";
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { default as classNames } from "classnames";
import cuid from "cuid";
import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";

const Home: NextPage = () => {
  const session = useSession();
  const uid = session.data?.user.id;
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (uid) {
      document.documentElement.style.overscrollBehavior = "none";
    }
  }, []);

  const { data: lists } = useQuery<TList[]>(
    ["lists"],
    async () => {
      const res = await fetch(`/api/users/${uid}/lists`);
      const { lists } = await res.json();
      return lists;
    },
    { enabled: !!uid }
  );

  const addListMutation = useMutation(
    async (newList: TList): Promise<TList> => {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList)
      });
      return await res.json();
    },
    {
      onMutate: async (newList) => {
        await queryClient.cancelQueries(["lists"]);
        const previousLists = queryClient.getQueryData(["lists"]);
        queryClient.setQueryData<TList[]>(["lists"], (old) => [...old!, newList]);
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
    }
  );

  const addList = async (): Promise<void> => {
    addListMutation.mutate(getNewList());
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => endRef.current && endRef.current.scrollIntoView({ block: "start", behavior: "smooth" }));
  };

  const updateListsArrayMutation = useMutation(
    async (newListsArray: TList[]): Promise<TList[]> => {
      const res = await fetch(`/api/users/${uid}/lists`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lists: newListsArray })
      });
      return await res.json();
    },
    {
      onMutate: async (newListsArray) => {
        await queryClient.cancelQueries(["lists"]);
        const previousListsArray = queryClient.getQueryData(["lists"]);
        queryClient.setQueryData<TList[]>(["lists"], newListsArray);
        return { previousListsArray };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (_err, _newList, context) => {
        context && context.previousListsArray && queryClient.setQueryData(["lists"], context.previousListsArray);
        errorToast();
      },
      // Always refetch after error or success
      onSettled: () => {
        queryClient.isMutating() === 1 && queryClient.invalidateQueries(["lists"]);
      }
    }
  );

  const getNewList = (): TList => {
    const lastIndex = lists && lists[lists.length - 1]?.index;
    const newList: TList = {
      id: cuid(),
      createdAt: new Date(),
      index: lastIndex ? lastIndex + 1024 : 102400,
      title: "New List",
      cards: [],
      userId: uid!
    };
    return newList;
  };

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  ];

  const handleDragEnd = async ({ active, over }: DragEndEvent): Promise<TList[] | void> => {
    if (lists && over && active.id !== over.id) {
      const activePos = lists.findIndex((list) => list.index === active.id);
      const overPos = lists.findIndex((list) => list.index === over.id);

      let newIndex: number;

      if (overPos === 0) newIndex = lists[overPos]!.index - 1024;
      else if (overPos === lists.length - 1) newIndex = lists[overPos]!.index + 1024;
      else newIndex = (lists[overPos]!.index + lists[overPos - 1]!.index) / 2;

      lists[activePos]!.index = newIndex;

      const newListsArray = arrayMove(lists, activePos, overPos);

      updateListsArrayMutation.mutate(newListsArray);
    }
  };

  return (
    <>
      {uid ? (
        <div
          className={classNames(
            "!overflow-x-auto overscroll-none w-screen -mx-5 -my-10 py-10 flex overflow-y-hidden h-[calc(100vh-4rem)]",
            !lists && "!overflow-x-hidden"
          )}>
          {lists ? (
            <>
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={lists.map((list) => list.index)}>
                  {lists.map((list: TList) => {
                    return <List key={list.id} {...list} />;
                  })}
                  <DragOverlay dropAnimation={{ duration: 0 }} />
                </SortableContext>
              </DndContext>
              <div ref={endRef} className="px-10 min-h-full min-w-fit">
                <div
                  className="hover:bg-neutral-800 rounded-lg p-3 text-center font-medium cursor-pointer w-72 text-sm"
                  onClick={addList}>
                  + Add
                </div>
              </div>
            </>
          ) : (
            <div className="flex divide-x-[1px] divide-neutral-700 min-w-fit">
              {Array(20)
                .fill(true)
                .map((_, i) => (
                  <ListSkeleton key={i} />
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 w-80 max-w-sm">
          <Logo className="w-12" />
          <button
            disabled={loading}
            onClick={(): void => {
              setLoading(true);
              signIn("google");
            }}
            className={classNames(
              "h-[4.5rem] px-5 bg-neutral-800 border w-full rounded-lg font-bold no-underline items-center flex justify-center space-x-3 hover:border-light",
              loading && "cursor-not-allowed hover:border-border"
            )}>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <GoogleIcon />
                <div className="whitespace-nowrap">Continue with Google</div>
              </>
            )}
          </button>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Home;
