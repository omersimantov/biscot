import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;

  if (req.method === "GET") {
    const list = await prisma.list.findFirstOrThrow({
      where: { id: id as string },
      include: { cards: { orderBy: { index: "asc" } } }
    });
    return res.status(200).json(list);
  }

  if (req.method === "PATCH") {
    try {
      await prisma.list.update({
        where: { id: id as string },
        data: { index: req.body.index, title: req.body.title }
      });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.list.delete({ where: { id: id as string } });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};
