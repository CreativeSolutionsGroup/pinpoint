"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ArchiveRestore, CopyPlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { GetArchivedEvents } from "@/lib/api/read/GetArchivedEvents";
import { UpdateArchive } from "@/lib/api/update/Event";
import DeleteEntity from "@/lib/api/delete/DeleteEntity";
import { duplicateEvent } from "@/lib/api/create/duplicateEvent";
import Link from "next/link";
import { EventWithLocationIds } from "@/types/Event";

interface ArchivedEventsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArchivedEventsDialog({ open, onOpenChange }: ArchivedEventsProps) {
  const [archivedEvents, setArchivedEvents] = useState<EventWithLocationIds[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unarchiveDialogOpen, setUnarchiveDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithLocationIds | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch archived events when dialog opens
  useEffect(() => {
    if (open) {
      loadArchivedEvents();
    }
  }, [open]);

  async function loadArchivedEvents() {
    setIsLoading(true);
    try {
      const events = await GetArchivedEvents();
      setArchivedEvents(events);
    } catch (error) {
      console.error("Failed to load archived events:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnarchive(eventId: string) {
    try {
      await UpdateArchive(eventId, false);
      setArchivedEvents(archivedEvents.filter((e) => e.id !== eventId));
      setUnarchiveDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to unarchive event:", error);
    }
  }

  async function handleDelete(eventId: string) {
    try {
      await DeleteEntity("event", eventId);
      setArchivedEvents(archivedEvents.filter((e) => e.id !== eventId));
      setDeleteDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
            <DialogTitle className="text-lg font-semibold">
              Archived Events
            </DialogTitle>
            <div className="space-y-4">
              <Label className="font-semibold">
                {archivedEvents.length === 0
                  ? "No archived events"
                  : `${archivedEvents.length} archived event${
                      archivedEvents.length !== 1 ? "s" : ""
                    }`}
              </Label>
              <div className="space-y-2 rounded-md border-gray-200 border-2 p-2 transition-all duration-300 max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center text-gray-500 py-4">
                    Loading archived events...
                  </div>
                ) : archivedEvents.length === 0 ? (
                  <div className="text-center text-gray-500 py-4">
                    No archived events found
                  </div>
                ) : (
                  archivedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex justify-between items-center hover:bg-gray-100 transition-all duration-300 py-2 px-3 rounded-md group"
                    >
                      <Link
                        href={`/home/event/${event.id}`}
                        className="flex flex-col flex-1 no-underline text-inherit"
                        onClick={() => onOpenChange(false)}
                      >
                        <p className="text-sm font-medium transition-colors">
                          {event.name}
                        </p>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          {event.locations.length > 0 && (
                            <span className="text-gray-600">
                              {event.locations.length} location{event.locations.length !== 1 ? 's' : ''}
                            </span>
                          )}
                          {event.isGS && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Getting Started
                            </span>
                          )}
                          {event.isCC && (
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Campus Christmas
                            </span>
                          )}
                        </div>
                      </Link>
                      <div className="flex gap-2">
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setDuplicateDialogOpen(true);
                          }}
                          title="Copy Event"
                        >
                          <CopyPlus className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setUnarchiveDialogOpen(true);
                          }}
                          title="Unarchive"
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-all duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Unarchive Confirmation Dialog */}
        <AlertDialog open={unarchiveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unarchive Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unarchive &quot;{selectedEvent?.name}
                &quot;? It will be restored to the active events list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setUnarchiveDialogOpen(false);
                  setSelectedEvent(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedEvent) {
                    handleUnarchive(selectedEvent.id);
                  }
                }}
              >
                Unarchive
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Event</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete &quot;
                {selectedEvent?.name}&quot;? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedEvent(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedEvent) {
                    handleDelete(selectedEvent.id);
                  }
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Duplicate Confirmation Dialog */}
        <AlertDialog open={duplicateDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Duplicate Event</AlertDialogTitle>
              <AlertDialogDescription>
                {`Are you sure you want to duplicate "${selectedEvent?.name}"?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDuplicateDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (selectedEvent) {
                    await duplicateEvent(selectedEvent);
                    setDuplicateDialogOpen(false);
                  }
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
  );
}
