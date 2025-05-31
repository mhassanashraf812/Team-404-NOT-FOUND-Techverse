import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";
import uploadFile from "@/lib/uploader";
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
      const { itemId, description } = req.body;
      const proofImages = [];
      for (const image of req.body.proofImages) {
        const url = await uploadFile(image);
        proofImages.push(url);
      }

      // Check if item exists and is active
      const item = await prisma.item.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        res.status(StatusCodes.NOT_FOUND);
        return res.json({ message: "Item not found" });
      }

      if (item.status !== "ACTIVE") {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({ message: "Item is not available for claims" });
      }

      // Check if user has already claimed this item
      const existingClaim = await prisma.claim.findFirst({
        where: {
          itemId,
          claimantId: session.user.id,
          status: {
            not: "REJECTED",
          },
        },
      });

      if (existingClaim) {
        res.status(StatusCodes.BAD_REQUEST);
        return res.json({ message: "You have already claimed this item" });
      }

      // Create the claim
      const claim = await prisma.claim.create({
        data: {
          description,
          proofImages,
          itemId,
          claimantId: session.user.id,
        },
      });

      await prisma.notification.create({
        data: {
          senderId: session.user.id,
          receiverId: item.userId,
          title: `${session.user.name} has claimed your item`,
        },
      });
      sendNotification(
        item.userId,
        `${session.user.name} has claimed your item`
      );

      res.status(StatusCodes.CREATED);
      res.json(claim);
    }
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
