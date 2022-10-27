import { Router } from "express";
import Scraper from "../scraper";

import { cacheRoute } from "../util/cacheRoute";

const router = Router();

router.get("/search", (req, res) => {
  // #swagger.tags = ['General']

  const { query } = req.query;

  const key = String(query).toLowerCase();

  if (!query) {
    return res.status(400).json({ error: "Empty query" });
  }

  cacheRoute({
    res,
    key,
    field: "search",
    fetchData: async () => {
      const search = await Scraper.search(key);

      return { search };
    },
  });
});

router.get("/ranking/:year/:month/:day/:country?", (req, res) => {
  const options = req.params;

  const key = JSON.stringify(options);

  cacheRoute({
    res,
    key,
    field: "ranking",
    fetchData: async () => {
      const teams = await Scraper.getRankingInfo(options);

      return { teams };
    },
  });
});

export default router;
