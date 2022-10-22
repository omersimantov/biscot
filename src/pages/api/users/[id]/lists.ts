import { List, prisma } from "@/lib/prisma/client";
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

  if (req.method === "PATCH") {
    const { lists } = req.body;
    try {
      await prisma.user.update({
        where: { id: id as string },
        data: {
          lists: {
            updateMany: lists.map((list: List) => ({
              where: { id: list.id },
              data: { index: list.index, title: list.title }
            }))
          }
        }
      });
      return res.status(200).json(lists);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};
