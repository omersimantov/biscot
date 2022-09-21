import { List } from "@/components/List";
import { ListSkeleton } from "@/components/ListSkeleton";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const [data, setData] = useState<List[]>();

  useEffect((): void => {
    fetchLists();
  }, []);

  const fetchLists = async (): Promise<void> => {
    const res = await fetch("/api/list");
    const data = await res.json();
    setData(data);
  };

  const createList = async (): Promise<void> => {
    const res = await fetch("/api/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New List" })
    });
    const data = await res.json();
    setData(data);
  };

  return (
    <>
      <Head>
        <title>Biscot</title>
      </Head>
      <div className="flex">
        <main className={classNames("py-10 flex min-h-screen", !data && "overflow-hidden")}>
          {data ? (
            <>
              {data.map((list) => (
                <List key={list.id} id={list.id} title={list.title} cards={list.cards} />
              ))}
              <div
                className="hover:bg-neutral-800 rounded-xl p-4 text-center font-medium cursor-pointer min-w-[18rem] ml-10 mr-[7.5rem]"
                onClick={createList}>
                + Add
              </div>
            </>
          ) : (
            <div className="flex mr-20 divide-x-[1px] divide-neutral-700">
              {Array(100)
                .fill(true)
                .map((_, i) => (
                  <ListSkeleton key={i} />
                ))}
            </div>
          )}
        </main>
        <nav className="w-16 border-l border-border flex flex-col items-center justify-end fixed right-0 h-full bg-bg">
          <Cog6ToothIcon className="w-6 cursor-pointer text-neutral-500 hover:text-white mb-10" strokeWidth={1} />
        </nav>
      </div>
    </>
  );
};

export default Home;
