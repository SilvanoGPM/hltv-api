import { Router } from "express";
import qs from 'query-string';

import Scraper from "../scraper";
import { redisClient } from '../service/redis';

const router = Router();

router.get("/search/:teamName", async (req, res) => {
  const { teamName } = req.params;

  const name = String(teamName).toLowerCase();

  const teamsFound = await redisClient.hGet(name, 'search');

  if (teamsFound) {
    return res.json(JSON.parse(teamsFound));
  }

  try {
    const teams = await Scraper.searchTeams(teamName);

    await redisClient.hSet(name, 'search', JSON.stringify(teams));

    res.json(teams);
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
});

router.get("/info/:teamId/:teamName", async (req, res) => {
  const { teamId, teamName } = req.params;

  const teamPath = `${teamId}/${teamName}`.toLowerCase();

  const infoFound = await redisClient.hGet(teamPath, 'info');

  if (infoFound) {
    return res.json(JSON.parse(infoFound));
  }

  try {
    const info = await Scraper.getTeamInfo(teamPath);

    await redisClient.hSet(teamPath, 'info', JSON.stringify(info));

    res.json(info);
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
});

router.get("/matches/:teamId", async (req, res) => {
  const { teamId } = req.params;

  const stringParams = qs.stringify(req.query);

  const key = `${teamId}?${stringParams}`.toLowerCase();

  const matchesFound = await redisClient.hGet(key, 'matches');

  if (matchesFound) {
    return res.json(JSON.parse(matchesFound));
  }

  try {
    const matches = await Scraper.getTeamMatches({ team: teamId, ...req.query });

    await redisClient.hSet(key, 'matches', JSON.stringify(matches));

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
});

export default router;
