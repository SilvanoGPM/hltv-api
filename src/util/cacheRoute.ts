import { Response } from "express";

import { redisClient } from "../service/redis";

interface HandleRouteParams {
  res: Response<any, Record<string, any>>;

  key: string;
  field: string;
  fetchData: () => Promise<any>;
}

export async function cacheRoute({
  res,
  key,
  field,
  fetchData,
}: HandleRouteParams) {
  const valueFound = await redisClient.hGet(key, field);

  if (valueFound) {
    return res.json(JSON.parse(valueFound));
  }

  try {
    const value = await fetchData();

    await redisClient.hSet(key, field, JSON.stringify(value));

    res.json(value);
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
}
