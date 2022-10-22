import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;

  if (req.method === "GET") {
    const card = await prisma.card.findFirstOrThrow({
      where: { id: id as string }
    });
    return res.status(200).json(card);
  }

  if (req.method === "PATCH") {
    try {
      await prisma.card.update({
        where: { id: id as string },
        data: {
          index: req.body.index,
          title: req.body.title.trim(),
          description: req.body.description
        }
      });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.card.delete({ where: { id: id as string } });
      res.status(200).end();
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
};
