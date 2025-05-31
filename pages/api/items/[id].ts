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
      allowedRoles: ["STUDENT", "FACULTY", "ADMIN"],
      method: "GET",
    });
    if (session) {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({ message: "Missing or invalid item ID" });
      }
      const item = await prisma.item.findUnique({
        where: { id },
        include: {
          user: true,
          claims: {
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
      if (!item) {
        res.status(StatusCodes.NOT_FOUND);
        return res.json({ message: "Item not found" });
      }
      res.status(StatusCodes.OK);
      res.json(item);
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
} 