import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;

  if (req.method === "GET") {
    const lists = await prisma.user.findFirstOrThrow({
      where: { id: id as string },
      select: { lists: { orderBy: [{ index: "asc" }], include: { cards: { orderBy: { index: "asc" } } } } }
    });
    return res.status(200).json(lists);
  }
};
