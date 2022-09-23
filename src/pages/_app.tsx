import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";
import "../styles/globals.css";

// TODO: T3 Monorepo (NextAuth?), PWA, animations

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} options={{ gestureEnabled: false }} />
    </SessionProvider>
  );
};

export default MyApp;
