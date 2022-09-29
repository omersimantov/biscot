import { prisma } from "@/lib/prisma/client";
import { Card } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    try {
      const lists = await prisma.list.findMany({
        where: { userId: req.body.userId },
        orderBy: [{ index: "asc" }],
        include: { cards: { orderBy: { index: "asc" } } }
      });
      return res.status(200).json(lists);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "POST") {
    const cards = req.body.cards.map((card: Card) => card);
    try {
      const list = await prisma.list.create({
        data: {
          id: req.body.id,
          createdAt: req.body.createdAt,
          index: req.body.index,
          title: req.body.title.trim(),
          cards: { createMany: { data: cards } }, // FIXME
          userId: req.body.userId
        },
        include: {
          cards: true
        }
      });
      return res.status(201).json(list);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "PATCH") {
    try {
      await prisma.list.update({
        where: { id: req.body.id },
        data: { title: req.body.title.trim() }
      });
      res.status(200).end();
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
