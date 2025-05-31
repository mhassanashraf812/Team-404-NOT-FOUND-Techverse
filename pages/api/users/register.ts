import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";
import { hashPassword } from "@/lib/authHelper";
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
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          name: req.body.name,
          password: await hashPassword(req.body.password),
          role: req.body.role,
          studentId: req.body.studentId,
          phone: req.body.phone,
          department: req.body.department,
        },
      });
      res.status(StatusCodes.OK);
      res.json({ message: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ message: "Internal server error" });
  }
}
