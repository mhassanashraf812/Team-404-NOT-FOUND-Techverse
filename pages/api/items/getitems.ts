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
      const items = await prisma.item.findMany({
        where: {
          userId: session.user.id,
          status: {
            not: "PENDING",
          },
        },
        include: {
          claims: {
            where: {
              status: {
                not: "REJECTED",
              },
            },
            include: {
              claimant: true,
              messages: {
                include: {
                  sender: true,
                  receiver: true,
                },
              },
            },
          },
        },
      });
      res.status(StatusCodes.OK);
      res.json(items);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
