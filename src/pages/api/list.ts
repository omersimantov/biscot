import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    try {
      const lists = await prisma.list.findMany({
        where: { userId: req.body.userId },
        include: { cards: true }
      });
      return res.status(200).json(lists);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      const list = await prisma.list.create({
        data: {
          id: req.body.id,
          index: req.body.index,
          title: req.body.title,
          userId: req.body.userId
        }
      });
      return res.status(201).json(list);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.list.delete({ where: { id: req.body.id } });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
