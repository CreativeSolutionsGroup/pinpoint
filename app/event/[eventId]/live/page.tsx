import LiveUpdateText from "@/components/LiveUpdateText";
import { prisma } from "@/lib/api/db";

interface EventLivePageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventLivePage({
  params,
}: EventLivePageProps) {
  const p = await params;
  const eventData = await prisma.event.findFirst({ where: { id: p.eventId } });

  if (!eventData) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex flex-col p-4">
      <LiveUpdateText />
    </div>
  );
}
