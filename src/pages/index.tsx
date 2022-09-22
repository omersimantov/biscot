import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Bars3Icon, EyeIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import cuid from "cuid";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [lists, setLists] = useState<List[]>();
  const userId = "cl8bw3e1t00159xpdasnwbgll"; // TODO: Get from session

  useEffect((): void => {
    fetchLists();
  }, []);

  const fetchLists = async (): Promise<void> => {
    const res = await fetch("/api/list");
    const data = await res.json();
    setLists(data);
  };

  const createList = async (): Promise<void> => {
    const id = cuid();
    const newList = {
      id,
      index: lists ? lists.length : 0,
      title: "New List",
      cards: [],
      userId
    };
    lists ? setLists([...lists, newList]) : setLists([newList]);
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
      <div className="flex min-h-screen">
        <main
          className={classNames("py-10 flex divide-x-[1px] divide-neutral-700 mr-[5rem]", !lists && "overflow-hidden")}>
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
              <div className="px-10 h-full min-w-fit">
                <div
                  className="hover:bg-neutral-800 rounded-xl h-full p-4 text-center font-medium cursor-pointer w-72"
                  onClick={createList}>
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
        <nav className="w-20 border-l border-border flex flex-col items-center justify-between py-10 fixed right-0 h-full bg-bg">
          <EyeIcon className="w-6 text-neutral-500" />
          <Bars3Icon className="w-6 cursor-pointer text-neutral-500 hover:text-white" />
        </nav>
      </div>
    </>
  );
};

export default Home;
