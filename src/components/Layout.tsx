import { Header } from "@/components/Header";
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <div onContextMenu={(e): false | void => (e.target as HTMLFormElement).form === undefined && e.preventDefault()}>
      <Header />
      <main className="flex px-5 justify-center items-center py-10 min-h-[calc(100vh-4rem)]">{children}</main>
    </div>
  );
};
