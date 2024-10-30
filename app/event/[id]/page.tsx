import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import ClientEventFlow from "@components/ClientEventFlow";

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

  return <ClientEventFlow />;
}