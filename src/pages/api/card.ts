import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "POST") {
    const list = await prisma.card.create({
      data: {
        index: 1,
        title: req.body.title,
        description: req.body.description,
        listId: req.body.listId
      }
    });
    return res.status(201).json(list);
  }

  if (req.method === "DELETE") {
    await prisma.card.delete({
      where: { id: req.body.id }
    });
    res.status(200).end();
  }
};
