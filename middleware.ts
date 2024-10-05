import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(`${request.nextUrl.origin}/home`);
  }
}

export const config = {
  matcher: ["/"],
};
