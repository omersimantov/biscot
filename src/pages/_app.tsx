import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import Head from "next/head";
import "../styles/globals.css";

// TODO: T3 Monorepo, PWA, animations

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
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
      <SessionProvider session={session}>
        <Component {...pageProps} options={{ gestureEnabled: false }} />
      </SessionProvider>
    </>
  );
};

export default MyApp;
