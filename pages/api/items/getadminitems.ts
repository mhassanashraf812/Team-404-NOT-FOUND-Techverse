// import { StatusCodes } from "http-status-codes";
// import { NextApiRequest, NextApiResponse } from "next";
// import prisma from "@/lib/prisma";
// import validateAPI from "@/lib/validateAPI";
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const session = await validateAPI({
//       req,
//       res,
//       sessionRequired: true,
//       allowedRoles: ["ADMIN"],
//       method: "POST",
//     });
//     if (session) {
//       const items = await prisma.item.findMany({
//         include: {
//           user: true,
//           claims: {
//             include: {
//               item: true,
//             },
//           },
//         },
//       });
//       res.status(StatusCodes.OK);
//       res.json(items);
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR);
//     res.json({ message: "Internal server error" });
//   }
// }

import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res
        .status(StatusCodes.METHOD_NOT_ALLOWED)
        .json({ message: "Only POST method allowed" });
    }

    const items = await prisma.item.findMany({
      include: {
        user: true,
        claims: {
          include: {
            item: true,
          },
        },
      },
    });

    res.status(StatusCodes.OK).json(items);
  } catch (error) {
    console.error("Error fetching admin items:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
}
