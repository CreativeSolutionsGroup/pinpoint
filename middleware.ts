import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  async function middleware(request: NextRequest) {
    // const session = await getServerSession();
    // const authUser = await prisma.authorizedUser.findFirst({
    //   where: {
    //     email: session?.user?.email ?? "",
    //   },
    // });
    
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(`${request.nextUrl.origin}/home`);
    }
    // if (request.nextUrl.pathname === `/event/${request.nextUrl.pathname.split("/")[2]}/${request.nextUrl.pathname.split("/")[3]}`) {
      

    // }
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
