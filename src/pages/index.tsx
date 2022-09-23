import { Header } from "@/components/Header";
import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import classNames from "classnames";
import cuid from "cuid";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
  const [lists, setLists] = useState<List[]>();
  const userId = "cl8bw3e1t00159xpdasnwbgll"; // TODO: Get from session
  const endRef = useRef<HTMLDivElement>(null);

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
      index: lists ? lists.length : 0,
      title: "New List",
      cards: [],
      userId
    };
    lists ? setLists([...lists, newList]) : setLists([newList]);
    // Unclear why the setTimeout is necessary, but it is
    setTimeout(() => {
      endRef.current && endRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
    });
    await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newList)
    });
  };

  return (
    <>
      <Head>
        <title>Biscot</title>
      </Head>
      <Header />
      <main
        className={classNames(
          "py-10 flex divide-x-[1px] divide-neutral-700 h-[calc(100vh-4rem)] overflow-auto overscroll-x-none",
          !lists && "overflow-hidden"
        )}>
        {lists ? (
          <>
            {lists.map((list) => (
              <List
                key={list.id}
                id={list.id}
                index={lists.length}
                title={list.title}
                cards={list.cards}
                userId={userId}
              />
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
  );
};

export default Home;
