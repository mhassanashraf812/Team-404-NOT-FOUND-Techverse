import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";
import { sendNotification } from "@/lib/sendNotification";
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
      const claim = await prisma.claim.update({
        where: {
          id: req.body.claimId,
        },
        data: {
          status: req.body.status,
        },
      });

      if (claim.status === "APPROVED") {
        await prisma.claim.updateMany({
          where: {
            itemId: claim.itemId,
            id: {
              not: claim.id,
            },
          },
          data: {
            status: "REJECTED",
          },
        });
      } else if (claim.status === "COMPLETED") {
        await prisma.item.update({
          where: {
            id: claim.itemId,
          },
          data: {
            status: "RETURNED",
          },
        });
      }

      await prisma.notification.create({
        data: {
          senderId: session.user.id,
          receiverId: claim.claimantId,
          title: `${session.user.name} has updated the claim status`,
        },
      });
      sendNotification(
        claim.claimantId,
        `${session.user.name} has updated the claim status`
      );
      res.status(StatusCodes.OK);
      res.json({ message: "Claim status updated successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
