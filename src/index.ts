import express from "express";
import swaggerUi from "swagger-ui-express";

import indexController from "./controller/indexController";
import teamsController from "./controller/teamsController";
import matchesController from "./controller/matchesController";
import playersController from "./controller/playersController";
import utilsController from "./controller/utilsController";

import { PORT } from "./service/env";
import { redisClient } from "./service/redis";

import swaggerDocs from './documentation/swagger.json';

const DEFAULT_RESPONSE = {
  status: "online",
  site: "https://www.hltv.org/",
  version: 1,
};

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get("/", (req, res) => {
  res.json(DEFAULT_RESPONSE);
});

app.get("/api/v1", (req, res) => {
  res.json(DEFAULT_RESPONSE);
});

app.use("/api/v1", indexController);
app.use("/api/v1/team", teamsController);
app.use("/api/v1/match", matchesController);
app.use("/api/v1/player", playersController);
app.use("/api/v1/util", utilsController);

app.listen(PORT, async () => {
  await redisClient.connect();

  console.log(`Listening on port: ${PORT}`);
});
