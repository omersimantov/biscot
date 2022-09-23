import type { AppType } from "next/app";
import "../styles/globals.css";

// TODO: T3 Monorepo, PWA, animations

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} options={{ gestureEnabled: false }} />;
};

export default MyApp;
