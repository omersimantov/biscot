import { prisma } from "@/lib/prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === "GET") {
    const lists = await prisma.list.findMany({
      where: { userId: "cl8awypsg0382ympdiqil045t" },
      include: { cards: true }
    });
    return res.status(200).json(lists);
  }
  if (req.method === "CREATE") {
    const list = await prisma.list.create({
      data: {
        index: 1,
        title: req.body.name,
        userId: "cl8awypsg0382ympdiqil045t"
      }
    });
    return res.status(201).json(list);
  }
  if (req.method === "DELETE") {
    await prisma.list.delete({
      where: { id: req.body.id }
    });
    res.status(200).end();
  }
};
