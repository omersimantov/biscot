import type { NextApiResponse } from "next";

export default async (res: NextApiResponse): Promise<void> => {
  res.status(405).end();
};
