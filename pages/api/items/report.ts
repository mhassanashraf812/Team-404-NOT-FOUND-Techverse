import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";
import uploadFile from "@/lib/uploader";
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
      const images = [];
      for (const image of req.body.images) {
        const url = await uploadFile(image);
        images.push(url);
      }
      const item = await prisma.item.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          type: req.body.type,
          dateFound: req.body.dateFound,
          dateLost: req.body.dateLost,
          location: req.body.location,
          images,
          tags: req.body.tags,
          contactInfo: req.body.contactInfo,
          reward: req.body.reward,
          userId: session.user.id,
          category: req.body.category,
          reporterEmail: session.user.email,
        },
      });
      res.status(StatusCodes.OK);
      res.json({ message: "Item reported successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
