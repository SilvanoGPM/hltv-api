import { Response } from "express";

import { redisClient } from "../service/redis";
import { handleRoute } from "./handleRoute";

interface HandleRouteParams {
  res: Response<any, Record<string, any>>;

  expire?: number;
  key: string;
  field: string;
  fetchData: () => Promise<any>;
}

export async function cacheRoute({
  res,
  key,
  field,
  fetchData,
  expire = 60 * 60, // one hour
}: HandleRouteParams) {
  const valueFound = await redisClient.hGet(key, field);

  if (valueFound) {
    return res.json(JSON.parse(valueFound));
  }

  handleRoute(async () => {
    const value = await fetchData();

    if (value.notCache) {
      return res.status(value.status).send();
    }

    await redisClient.hSet(key, field, JSON.stringify(value));

    await redisClient.expire(key, expire)

    res.json(value);
  }, res);
}
