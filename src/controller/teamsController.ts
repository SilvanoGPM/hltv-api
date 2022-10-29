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

      return search.teams;
    },
  });
});

router.get("/info/:teamId", async (req, res) => {
  const { teamId } = req.params;

  cacheRoute({
    res,
    key: teamId.toLowerCase(),
    field: "team/info",
    fetchData: async () => {
      const info = await Scraper.getTeamInfo(teamId);

      if (info.notFound) {
        return { notCache: true, status: 400 };
      }

      return info;
    },
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
