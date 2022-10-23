import { Layout } from "@/components/Layout";
import { DehydratedState, Hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppType } from "next/app";
import Head from "next/head";
import { useState } from "react";
import "../styles/globals.css";

const MyApp: AppType<{ dehydratedState: DehydratedState }> = ({ Component, pageProps }): JSX.Element => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Biscot</title>
        <meta
          name="description"
          content="Biscot is a minimal alternative to Trello for people who use it for personal stuff."
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
