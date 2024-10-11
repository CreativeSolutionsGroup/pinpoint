import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";

export default async function EventMainPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }

  return (
    <div className="flex flex-col h-screen">
      <h1 className="animate-spin text-2xl text-center my-auto">
        {event.name}
      </h1>
    </div>
  );
}
