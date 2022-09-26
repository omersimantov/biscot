import type { Card } from "@/lib/types/Card";

export type List = {
  id: string;
  createdAt: string;
  index: number;
  title: string;
  userId: string;
  cards: Card[];
};
