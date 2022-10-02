import SEO from "@/components/SEO";
import { NextPage } from "next";

const Custom404: NextPage = () => {
  return (
    <>
      <SEO title="404" noindex nofollow />
      <main className="flex justify-center items-center text-center min-h-screen">
        <h1 className="font-bold text-xl">404</h1>
      </main>
    </>
  );
};

export default Custom404;
