import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    try {
      const card = await prisma.card.create({
        data: {
          id: req.body.id,
          createdAt: req.body.createdAt,
          index: req.body.index,
          title: req.body.title.trim(),
          description: req.body.description,
          listId: req.body.listId
        }
      });
      return res.status(201).json(card);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
