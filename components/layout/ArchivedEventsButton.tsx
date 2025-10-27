"use client";

import { Archive } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import ArchivedEventsDialog from "../ArchivedEventsDialog";

export default function ArchivedEventsButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center mx-2 mb-1 bg-sidebar hover:bg-secondary transition-colors rounded-md cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="text-sm font-medium grow ml-2.5">Archived Events</span>
        <Button variant="ghost" className="p-0.5">
          <Archive className="h-5 w-5 text-muted-foreground mr-3.5 my-2" />
        </Button>
      </div>
      <ArchivedEventsDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
