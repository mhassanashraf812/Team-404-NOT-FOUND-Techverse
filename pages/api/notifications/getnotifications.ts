import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await validateAPI({
      req,
      res,
      sessionRequired: true,
      allowedRoles: ["STUDENT", "FACULTY"],
      method: "POST",
    });
    if (session) {
      const notifications = await prisma.notification.findMany({
        where: {
          receiverId: session.user.id,
        },

        include: {
          sender: true,
        },
      });

      res.status(StatusCodes.OK);
      res.json(notifications);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
