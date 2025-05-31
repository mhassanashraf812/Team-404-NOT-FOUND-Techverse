import { hashPassword } from "@/lib/authHelper";
import prisma from "../lib/prisma";

async function main() {
  const user = await prisma.user.findFirst({
    where: {
      email: "admin@umt.edu.pk",
      role: "ADMIN",
    },
  });
  if (!user) {
    await prisma.user.create({
      data: {
        email: "admin@umt.edu.pk",
        isVerified: true,
        name: "Admin",
        password: await hashPassword("password"),
        role: "ADMIN",
      },
    });
  } else {
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email: "admin@umt.edu.pk",
        name: "Admin",
        password: await hashPassword("password"),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
