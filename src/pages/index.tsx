import { GoogleIcon } from "@/components/GoogleIcon";
import { Header } from "@/components/Header";
import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Logo } from "@/components/Logo";
import { Spinner } from "@/components/Spinner";
import type { List as TList } from "@/lib/prisma/client";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { default as classNames } from "classnames";
import cuid from "cuid";
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";

export const showToast = (id: string, undo: () => void): void => {
  toast.custom(
    <div
      className="rounded-lg p-4 border-border border cursor-pointer bg-neutral-900"
      onClick={(): void => {
        undo();
        toast.remove(id);
      }}>
      <ArrowUturnLeftIcon className="w-4 text-white" strokeWidth={2} />
    </div>,
    {
      position: "bottom-left",
      duration: 5000,
      id
    }
  );
};

const Home: NextPage<{ uid: string }> = ({ uid }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const endRef = useRef<HTMLDivElement>(null);

  const fetchLists = async (): Promise<TList[]> => {
    const res = await fetch("/api/list");
    const data = await res.json();
    return data;
  };

  const { data: lists, mutate } = useSWR<TList[]>("/api/list", fetchLists, { refreshInterval: 0 });

  const addList = async (): Promise<void> => {
    const newList = getNewList();
    // Unclear why the setTimeout is necessary, but it is
    setTimeout((): void => {
      endRef.current && endRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    const newListsArray = lists ? [...lists, newList] : [newList];
    const addList = async (): Promise<TList[]> => {
      await fetch("/api/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newList)
      });
      return newListsArray;
    };
    mutate(addList(), { optimisticData: newListsArray, rollbackOnError: true });
  };

  const getNewList = (): TList => {
    const lastIndex = lists && lists[lists.length - 1]?.index;
    const newList: TList = {
      id: cuid(),
      createdAt: new Date(),
      index: lastIndex ? lastIndex + 1024 : 65535,
      title: "",
      cards: [],
      userId: uid
    };

    return newList;
  };

  return (
    <>
      <Header />
      {uid ? (
        <main
          className={classNames(
            "py-10 flex h-[calc(100vh-4rem)] !overflow-x-auto overscroll-x-none",
            lists && "divide-x-[1px] divide-neutral-700",
            !lists && "!overflow-x-hidden"
          )}>
          {lists ? (
            <>
              {lists.map((list) => (
                <List key={list.index} {...list} />
              ))}
              <div ref={endRef} className="px-10 min-h-full min-w-fit">
                <div
                  className="hover:bg-neutral-800 rounded-lg p-3 text-center font-medium cursor-pointer w-72 text-sm"
                  onClick={addList}>
                  + Add
                </div>
              </div>
            </>
          ) : (
            <div className="flex mr-20 divide-x-[1px] divide-neutral-700 min-w-fit">
              {Array(100)
                .fill(true)
                .map((_, i) => (
                  <ListSkeleton key={i} />
                ))}
            </div>
          )}
        </main>
      ) : (
        <main className="flex px-5 justify-center items-center py-10 min-h-[calc(100vh-4rem)]">
          <div className="space-y-6 w-80 max-w-sm">
            <Logo className="w-10" />
            <button
              disabled={loading}
              onClick={(): void => {
                setLoading(true);
                signIn("google");
              }}
              className={classNames(
                "h-[4.5rem] px-5 border-border bg-neutral-800 border w-full rounded-lg font-bold no-underline items-center flex justify-center space-x-3 hover:border-borderLight",
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
        </main>
      )}
      <Toaster />
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx);
  if (!session) return { props: {} };
  const uid = session.user.id;
  return { props: { uid } };
};
