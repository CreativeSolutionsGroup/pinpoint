import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(`${request.nextUrl.origin}/home`);
    }
  },
  {
    callbacks: {
      authorized: async ({ req, token }) => {
        if (req.nextUrl.pathname === "/signin") {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!.swa).*)"],
};
