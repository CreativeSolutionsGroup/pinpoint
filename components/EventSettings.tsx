"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Event, type Location } from "@prisma/client";
import { Plus, Settings, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { SyncLocations, UpdateName } from "@/lib/api/update/Event";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LocationAdder from "./LocationCreator";
import { Form, FormField } from "./ui/form";
import { useParams, useRouter } from "next/navigation";

const formSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  eventLocations: z.array(z.string()).optional(),
});

export default function EventSettings({
  event,
  locations,
}: {
  event: Event;
  locations: Location[];
}) {
  const [locationAdderOpen, setLocationAdderOpen] = useState(false);
  const [currentLocations, setCurrentLocations] = useState<Location[]>(
    locations.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locationId = Array.isArray(params.locationId)
    ? params.locationId[0]
    : params.locationId;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventName: event.name,
      eventLocations: locations.map((location) => location.id),
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await SyncLocations(event, data.eventLocations ?? []);
    await UpdateName(event.id, data.eventName);
    setIsOpen(false);
    setLocationAdderOpen(false);
    if (!data.eventLocations?.find((v) => v === locationId)) {
      router.push(`/event/edit/${event.id}/${data.eventLocations?.[0]}`);
    }
  }

  useEffect(() => {
    form.setValue(
      "eventLocations",
      currentLocations.map((location) => location.id)
    );
    setCurrentLocations(
      currentLocations.sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [currentLocations, form]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="flex items-center justify-center h-10 w-10 bg-white rounded-full hover:bg-gray-100 transition-all duration-300">
          <Settings />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold">
            Event Settings
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <div className="space-y-1">
                    <Label htmlFor="eventName" className="font-semibold">
                      Event Name
                    </Label>
                    <Input
                      id="eventName"
                      placeholder="Enter event name"
                      {...field}
                    />
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="eventLocations"
                render={({ field }) => (
                  <div>
                    <Label htmlFor="eventLocations" className="font-semibold">
                      Event Locations
                    </Label>
                    <div
                      id="eventLocations"
                      className="space-y-2 rounded-md border-gray-200 border-2 p-2 pt-0 transition-all duration-300 max-h-[45vh] overflow-y-auto"
                    >
                      <div
                        className="flex items-center justify-center sticky top-0 bg-white z-10 mt-1"
                        onClick={() => {
                          setLocationAdderOpen(true);
                        }}
                      >
                        <div className="flex items-center space-x-1 hover:bg-gray-100 p-1 rounded-md transition-all duration-300 text-sm text-gray-600 cursor-pointer pr-2">
                          <Plus className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600 hover:bg-gray-100 rounded-full p-1 transition-all duration-300" />
                          Add Location
                        </div>
                      </div>
                      {field.value?.map((location, index) => (
                        <div
                          key={`fields-${index}`}
                          className="space-y-1 flex justify-between hover:bg-gray-100 transition-all duration-300 py-1 px-2 rounded-md"
                        >
                          <p className="text-sm">
                            {currentLocations.find((v) => v.id === location)
                              ?.name ?? location}
                          </p>
                          <Trash
                            className="h-4 w-4 text-red-500 cursor-pointer hover:text-red-600 transition-all duration-300"
                            onClick={() => {
                              field.onChange([
                                ...(field.value?.slice(0, index) ?? []),
                                ...(field.value?.slice(index + 1) ?? []),
                              ]);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="w-full h-10 bg-gray-700 text-white rounded-md hover:bg-gray-900 transition-all duration-300"
                  onClick={() => {
                    setLocationAdderOpen(false);
                    form.reset();
                    setCurrentLocations(locations);
                    setIsOpen(false);
                  }}
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  className="w-full h-10 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <LocationAdder
        eventId={event.id}
        currentLocations={currentLocations}
        setCurrentLocations={(newLocations) =>
          setCurrentLocations(newLocations)
        }
        isOpen={locationAdderOpen}
        onClose={() => setLocationAdderOpen(false)}
      />
    </>
  );
}
