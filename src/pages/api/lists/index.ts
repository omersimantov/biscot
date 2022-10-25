import { prisma } from "@/lib/prisma/client";
import { Card } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    try {
      const lists = await prisma.list.findMany({
        orderBy: [{ index: "asc" }],
        include: { cards: { orderBy: { index: "asc" } } }
      });
      return res.status(200).json(lists);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  if (req.method === "POST") {
    try {
      const list = await prisma.list.create({
        data: {
          id: req.body.id,
          createdAt: req.body.createdAt,
          index: req.body.index,
          title: req.body.title.trim(),
          userId: req.body.userId
        },
        include: { cards: true }
      });
      const cards = req.body.cards.map((card: Card) => card);
      await prisma.card.createMany({ data: cards });
      list.cards = cards;
      return res.status(201).json(list);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};
