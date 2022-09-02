import express from "express";

import { config } from 'dotenv';

import teamsController from './controller/teamsController';

config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/api/v1/team', teamsController);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
