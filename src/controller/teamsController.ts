import { Router } from "express";
import qs from "query-string";

import Scraper from "../scraper";
import { cacheRoute } from "../util/cacheRoute";

const router = Router();

router.get("/search/:teamName", async (req, res) => {
  const { teamName } = req.params;

  const key = String(teamName).toLowerCase();

  cacheRoute({
    res,
    key,
    field: "team/search",
    fetchData: async () => {
      const search = await Scraper.search(teamName);

      return { teams: search.team };
    },
  });
});

router.get("/info/:teamId/:teamName", async (req, res) => {
  const { teamId, teamName } = req.params;

  const teamPath = `${teamId}/${teamName}`.toLowerCase();

  cacheRoute({
    res,
    key: teamPath,
    field: "team/info",
    fetchData: async () => Scraper.getTeamInfo(teamPath),
  });
});

router.get("/matches/:teamId", async (req, res) => {
  const { teamId } = req.params;

  const stringParams = qs.stringify(req.query);

  const key = `${teamId}?${stringParams}`.toLowerCase();

  cacheRoute({
    res,
    key,
    field: "team/matches",

    fetchData: async () =>
      Scraper.getTeamMatches({
        team: teamId,
        ...req.query,
      }),
  });
});

export default router;
