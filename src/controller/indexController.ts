import { Router } from "express";
import Scraper from '../scraper';

import { cacheRoute } from '../util/cacheRoute';

const router = Router();

router.get("/search", (req, res) => {
  const { query } = req.query;

  const key = String(query).toLowerCase();

  if (!query) {
    return res.status(400).json({ error: 'Empty query' });
  }

  cacheRoute({
    res,
    key,
    field: "team/search",
    fetchData: async () => {
      const search = await Scraper.search(key);

      return { search };
    },
  });
});

export default router;
