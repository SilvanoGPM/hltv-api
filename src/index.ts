import express from "express";

import teamsController from './controller/teamsController';
import { PORT } from './service/env';
import { redisClient } from './service/redis';

const DEFAULT_RESPONSE = {
  status: 'online',
  site: 'https://www.hltv.org/',
  version: 1,
};

const app = express();

app.get('/', (req, res) => {
  res.json(DEFAULT_RESPONSE);
});

app.get('/api/v1', (req, res) => {
  res.json(DEFAULT_RESPONSE);
});

app.use('/api/v1/team', teamsController);

app.listen(PORT, async () => {
  await redisClient.connect();

  console.log(`Listening on port: ${PORT}`);
});
