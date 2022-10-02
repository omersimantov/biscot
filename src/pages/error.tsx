import SEO from "@/components/SEO";
import { NextPage } from "next";

const CustomError: NextPage = () => {
  return (
    <>
      <SEO title="500" noindex nofollow />
      <h1 className="font-bold text-xl">500</h1>
    </>
  );
};

export default CustomError;
