import { EventWithLocations } from "@/types/Event";
import { Location } from "@prisma/client";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "./ui/breadcrumb";


interface BreadcrumbProps {
  event?: EventWithLocations | null,
  location?: Location,
}

export default function EventBreadcrumb({event, location}: BreadcrumbProps) {

    return (
        <Breadcrumb className="rounded border border-gray bg-white p-2 w-fit 
                               md:static md:m-0 md:top-auto md:left-auto md:h-auto md:overflow-auto 
                               fixed m-1.5 top-0 left-14 h-9 overflow-hidden">
            <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbLink href="/home">
                    Home
                </BreadcrumbLink>
                </BreadcrumbItem>
                {event?.id ? 
                <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                    <BreadcrumbLink href={`/home/event/${event.id}`}>
                        {event.name ?? "Event"}
                    </BreadcrumbLink>
                    </BreadcrumbItem>
                </>
                :
                <></>
                }
                {location?.id ? 
                <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/event/edit/${event?.id}/${location.id}`}>
                            {location.name ?? "Location"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </>
                :
                <></>
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}