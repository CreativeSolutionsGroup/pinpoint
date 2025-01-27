import { prisma } from "@/lib/api/db";
import { redirect } from "next/navigation";
import EventFlow from "@/components/EventFlow";
import { getServerSession } from "next-auth/next";

export default async function EventMainPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  const authUser = await prisma.authorizedUser.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  const event = await prisma.event.findFirst({
    where: {
      id: params.id,
    },
  });

  if (!event) {
    redirect("/home?error=Event not found");
  }
  return <EventFlow event={event} userRole={authUser?.role} />;
}