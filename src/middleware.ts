import { NextMiddleware, NextResponse, userAgent } from "next/server";

const middleware: NextMiddleware = async (req) => {
  const { isBot } = userAgent(req);

  // DDOS Prevention: Immediately end request with no response — avoids a redirect as well initiated by NextAuth on invalid callback
  if (isBot) {
    req.nextUrl.pathname = "/api/forbidden";
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
};

export default middleware;
