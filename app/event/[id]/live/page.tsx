import LiveUpdateText from "@/components/LiveUpdateText";
import { prisma } from "@/lib/api/db";

export default async function EventLivePage({
  params,
}: {
  params: { id: string };
}) {
  const eventData = await prisma.event.findFirst({ where: { id: params.id } });

  if (!eventData) {
    return <div>Event not found</div>;
  }

  return (
    <div className="flex flex-col p-4">
      <LiveUpdateText></LiveUpdateText>
      {eventData.liveUpdate}
    </div>
  );
}
