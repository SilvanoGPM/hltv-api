import { Router } from "express";

import Scraper from "../scraper";

const router = Router();

router.get("/search/:teamName", async (req, res) => {
  const { teamName } = req.params;

  try {
    const teams = await Scraper.searchTeams(teamName);

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

  const teamPath = `${teamId}/${teamName}`;

  try {
    const info = await Scraper.getTeamInfo(teamPath);

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

  try {
    const matches = await Scraper.getTeamMatches({ team: teamId, ...req.query });

    res.json(matches);
  } catch (error) {
    res.status(500).json({
      message: "Error on server.",
      error,
    });
  }
});

export default router;
