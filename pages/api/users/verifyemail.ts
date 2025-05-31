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
      sessionRequired: false,
      allowedRoles: [],
      method: "POST",
    });
    if (session) {
      let count = 0;

      if (req.body.action == "view") {
        count = await prisma.user.count({
          where: {
            email: req.body.email,
            id: {
              not: req.body.id,
            },
          },
        });
      } else {
        count = await prisma.user.count({
          where: {
            email: req.body.email,
          },
        });
      }

      res.status(StatusCodes.OK);
      res.json(!(count > 0));
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
