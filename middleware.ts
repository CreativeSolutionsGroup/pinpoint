import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
/* import { prisma } from "@/lib/api/db";

// is the path an edit mode
const isEditMode = (pathname: string) => {
  const parts = pathname.split("/");
  return parts[2] === "edit"; // /event/edit/...
};

// does the user have permissions?
const hasEditPermissions = (role?: string) => {
  if (!role) return false;
  const allowedRoles = ["EDITOR", "ADMIN"];
  return allowedRoles.includes(role);
}; */

export default withAuth(
  async function middleware(request: NextRequest) {
    // handle the redirect to home
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(`${request.nextUrl.origin}/home`);
    }

    // get the users token (given to us from next auth)
    const token = await getToken({ req: request });

    // if theyre not logged in and they're not trying to sign in, redirect to /signin
    if (!token?.email && request.nextUrl.pathname !== "/signin") {
      return NextResponse.redirect(`/signin`); //`${request.nextUrl.origin}
    }

    // for event routes, check the users permissions
    //! prisma doesn't like running here? moving this logic to the eventFlow page for now
    /* if (request.nextUrl.pathname.startsWith("/event/")) {
      // get users roles from database
      const authUser = await prisma.authorizedUser.findUnique({
        where: {
          email: token?.email ?? "",
        },
      });

      // if they're trying to edit, make sure they have edit permission or higher
      if (isEditMode(request.nextUrl.pathname)) {
        if (!hasEditPermissions(authUser.role)) {
          const viewPath = request.nextUrl.pathname.replace("/edit/", "/view/");
          return NextResponse.redirect(`${request.nextUrl.origin}${viewPath}`);
        }
      }
    } */
    return NextResponse.next();
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
