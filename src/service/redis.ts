import { createClient } from "redis";

import { REDIS_URL } from './env';

export const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (err) => {
  console.log("Error occured while connecting or accessing redis server");
});
