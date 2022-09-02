import express from "express";

import teamsController from './controller/teamsController';
import { PORT } from './service/env';
import { redisClient } from './service/redis';

const app = express();

app.use('/api/v1/team', teamsController);

app.listen(PORT, async () => {
  await redisClient.connect();

  console.log(`Listening on port: ${PORT}`);
});
