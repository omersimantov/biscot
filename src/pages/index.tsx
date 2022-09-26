import { GoogleIcon } from "@/components/GoogleIcon";
import { Header } from "@/components/Header";
import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import type { List as TList } from "@/lib/types/List";
import { CakeIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import cuid from "cuid";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const [lists, setLists] = useState<TList[]>();
  const endRef = useRef<HTMLDivElement>(null);

  // TODO: Get from session
  const session = "f";
  const userId = "cl8bw3e1t00159xpdasnwbgll";

  useEffect((): void => {
    fetchLists();
  }, []);

  const fetchLists = async (): Promise<void> => {
    const res = await fetch("/api/list");
    const data = await res.json();
    setLists(data);
  };

  const addList = async (): Promise<void> => {
    const id = cuid();
    const newList = {
      id,
      createdAt: new Date().toISOString(),
      index: lists ? lists.length : 0,
      title: "New List",
      cards: [],
      userId
    };
    lists ? setLists([...lists, newList]) : setLists([newList]);
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => {
      endRef.current && endRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    });
    await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList)
    });
  };

  return (
    <>
      {session ? (
        <>
          <Header />
          <main
            className={classNames(
              "py-10 flex divide-x-[1px] divide-neutral-700 h-[calc(100vh-4rem)] overflow-auto overscroll-x-none",
              !lists && "overflow-hidden"
            )}>
            {lists ? (
              <>
                {lists.map((list) => (
                  <List key={list.id} {...list} />
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
        </>
      ) : (
        <>
          <Header />
          <main className="grid px-5 items-center py-10 min-h-[calc(100vh-4rem)]">
            <div className="space-y-6">
              <CakeIcon className="w-9 mx-auto" strokeWidth={1} />
              <div className="max-w-xs text-center text-lg mx-auto">
                Biscot is a minimal alternative to Trello for people who use it for personal stuff.
              </div>
              <a
                className="text-center p-5 mx-auto border-border bg-neutral-800 border rounded-lg w-80 max-w-full 
            font-bold no-underline items-center flex justify-center space-x-3 hover:border-borderLight">
                <GoogleIcon />
                <div>Continue with Google</div>
              </a>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default Home;
