import SEO from "@/components/SEO";
import { Spinner } from "@/components/Spinner";
import { NextPage } from "next";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

const Signout: NextPage = () => {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <>
      <SEO title="Sign Out" noindex nofollow />
      <div className="max-w-sm space-y-6">
        <Spinner />
        <div className="font-medium">Signing you out...</div>
      </div>
    </>
  );
};

export default Signout;
