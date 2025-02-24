import { prisma } from "@/lib/api/db";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const session = await getSession();
      if (session?.user?.email) {
        const user = await prisma.authorizedUser.findUnique({
          where: { email: session.user.email },
        });
        if (user) {
          setRole(user.role);
        }
      }
    };

    fetchUserRole();
  });

  return role;
};