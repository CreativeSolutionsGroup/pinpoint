import { LogIn, Settings2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import SideBarHelper from "./sidebar-helper";
import Image from "next/image";

export default async function Sidebar() {
  const session = await getServerSession();

  return (
    <SideBarHelper>
      <Image className="text-xl font-semibold mt-2.5 ml-4 antialiased" src="/pinpoint-logo-color.png" width={128} height={32} alt="Pinpoint" />
      <div className="mt-3 ml-4 flex flex-col">
        <span className="font-semibold grow">Recent Maps</span>
        <div className="flex flex-col pl-1 mt-1 ml-1 border-l-1 border-border">
          <span className="text-sm">Event name</span>
          <span className="text-sm text-muted-foreground ml-2 bg-sidebar hover:bg-secondary transition-colors px-1 rounded-md max-w-40 cursor-pointer">
            Some location
          </span>
        </div>
        <div className="flex mt-1 flex-col pl-1 ml-1 border-l-1 border-border">
          <span className="text-sm">Event name</span>
          <span className="text-sm text-muted-foreground ml-2 bg-sidebar hover:bg-secondary transition-colors px-1 rounded-md max-w-40 cursor-pointer">
            Some location that is very long and will continue to the next line
          </span>
        </div>
      </div>
      <div className="grow"></div>
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
