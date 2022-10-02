import SEO from "@/components/SEO";
import { NextPage } from "next";

const Custom404: NextPage = () => {
  return (
    <>
      <SEO title="404" noindex nofollow />
      <h1 className="font-bold text-xl">404</h1>
    </>
  );
};

export default Custom404;
