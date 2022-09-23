import { NextMiddleware, NextResponse, userAgent } from "next/server";

const middleware: NextMiddleware = async (req) => {
  const { isBot } = userAgent(req);

  // DDOS Prevention: Immediately end request with no response
  if (isBot) {
    req.nextUrl.pathname = "/api/forbidden";
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
};

export default middleware;
