import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    try {
      const list = await prisma.card.create({
        data: {
          id: req.body.id,
          index: req.body.index,
          title: req.body.title.trim(),
          listId: req.body.listId
        }
      });
      return res.status(201).json(list);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.card.delete({
        where: { id: req.body.id }
      });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "PATCH") {
    try {
      await prisma.card.update({
        where: { id: req.body.id },
        data: { title: req.body.title.trim(), description: req.body.description.trim() }
      });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
