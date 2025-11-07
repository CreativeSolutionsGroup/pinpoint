import { LogIn, Settings2, Bug } from "lucide-react";
import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SideBarHelper from "./sidebar-helper";
import Image from "next/image";
import Logo from "@/public/pinpoint-logo-color.png";
import { getRecents } from "@/lib/recents/read";
import Link from "next/link";

export default async function Sidebar() {
  const session = await getServerSession();
  const recents = session?.user?.email
    ? await getRecents(session.user?.email)
    : [];

  return (
    <SideBarHelper>
      <Image
        className="text-xl font-semibold mt-2.5 ml-4 antialiased"
        src={Logo}
        width={128}
        height={32}
        alt="Pinpoint"
      />
      <div className="mt-3 ml-4 flex flex-col">
        <span className="font-semibold grow">Recent Maps</span>
        {recents.length === 0 && (
          <span className="text-sm text-muted-foreground mt-1">
            No recent maps
          </span>
        )}
        {recents.map((recent) => (
          <Link
            key={recent.eventId + recent.locationId}
            href={`/event/edit/${recent.eventId}/${recent.locationId}`}
            className="flex flex-col pl-1 mt-1 ml-1 border-l-1 border-border no-underline hover:bg-secondary rounded-md transition-colors w-full sm:max-w-[10.5rem] pr-2 py-1"
          >
            <span className="text-sm w-full sm:max-w-40 sm:truncate">
              {recent.eventName}
            </span>
            <span className="text-sm text-muted-foreground ml-2 bg-sidebar px-1 rounded-md w-full sm:max-w-40 cursor-pointer">
              {recent.locationName}
            </span>
          </Link>
        ))}
      </div>
      <div className="grow"></div>
      <div className="flex items-center mx-2 mb-1 bg-sidebar hover:bg-secondary transition-colors rounded-md cursor-pointer">
        <a href="https://forms.office.com/r/DbgedKRdxV" target="_blank" className="text-sm font-medium grow ml-2.5">Give Feedback</a>
        <Bug className="h-5 w-5 text-muted-foreground mr-3.5 my-2" />
      </div>
      <div className="flex items-center mx-2 mb-1 bg-sidebar hover:bg-secondary transition-colors rounded-md cursor-pointer">
        <span className="text-sm font-medium grow ml-2.5">Settings</span>
        <Settings2 className="h-5 w-5 text-muted-foreground mr-3.5 my-2" />
      </div>
      {session ? (
        <Popover>
          <PopoverTrigger className="flex items-center p-2 mb-2 mx-2 bg-sidebar hover:bg-secondary transition-colors rounded-md cursor-pointer">
            <span className="text-sm font-medium grow ml-1 text-left">
              {session?.user?.name || "User"}
            </span>
            <Avatar className="outline-1 outline-border hover:outline-2 hover:outline-offset-1 cursor-pointer">
              <AvatarImage
                src={session?.user?.image ?? "https://example.com/avatar.png"}
                alt="User avatar"
              />
              <AvatarFallback>
                {session?.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") ?? "U"}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="mb-1 ml-2">
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {session?.user?.name || "User"}
              </span>
              <span className="text-sm text-muted-foreground">
                {session?.user?.email || "user@example.com"}
              </span>
              <div className="flex flex-col mt-2">
                <form action="/api/auth/signout">
                  <Button variant="outline" className="w-full cursor-pointer">
                    Logout
                  </Button>
                </form>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center">
          <span className="text-sm font-medium grow ml-5">Guest</span>
          <form action="/api/auth/signin">
            <Button variant="outline" className="w-min m-1.5 cursor-pointer">
              <LogIn className="h-4 w-4 mx-1" />
            </Button>
          </form>
        </div>
      )}
    </SideBarHelper>
  );
}
