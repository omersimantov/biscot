import { Layout } from "@/components/Layout";
import type { AppType } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Biscot</title>
        <meta
          name="description"
          content="Biscot is a minimal alternative to Trello for people who use it for personal stuff"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
};

export default MyApp;
