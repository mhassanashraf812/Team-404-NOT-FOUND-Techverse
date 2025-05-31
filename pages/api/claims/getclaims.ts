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
      const claim = await prisma.claim.findMany({
        where: {
          claimantId: session.user.id,
        },

        include: {
          claimant: true,
          item: true,
          messages: {
            include: {
              sender: true,
              receiver: true,
            },
          },
        },
      });

      res.status(StatusCodes.OK);
      res.json(claim);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
