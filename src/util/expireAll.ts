import { redisClient } from "../service/redis";

export async function expireAll() {
  const keys = await redisClient.KEYS("*");

  await Promise.all(keys.map((key) => redisClient.expire(key, 0)));

  return keys;
}
