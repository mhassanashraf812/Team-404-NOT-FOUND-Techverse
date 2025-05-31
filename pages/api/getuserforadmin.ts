import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import validateAPI from "@/lib/validateAPI";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow GET requests for fetching users
    if (req.method !== "POST") {
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message: "Only GET allowed" });
    }



    // Fetch users with their items to calculate counts
    const users = await prisma.user.findMany({
      include: {
        items: true, // include items relation
      },
      orderBy: { createdAt: "desc" },
    });

    // Map users to add some computed fields you want to return
    const mappedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      phone: user.phone,
      verified: user.isVerified,
      joinDate: user.createdAt.toISOString(),
      itemsPosted: user.items.length,
    }));

    return res.status(StatusCodes.OK).json(mappedUsers);
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
}
