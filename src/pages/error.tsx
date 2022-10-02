import SEO from "@/components/SEO";
import { NextPage } from "next";

const CustomError: NextPage = () => {
  return (
    <>
      <SEO title="500" noindex nofollow />
      <main className="flex justify-center items-center text-center min-h-screen">
        <h1 className="font-bold text-xl">500</h1>
      </main>
    </>
  );
};

export default CustomError;
