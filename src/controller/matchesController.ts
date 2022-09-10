import { Router } from 'express';

import Scraper from '../scraper';
import { cacheRoute } from '../util/cacheRoute';

const router = Router();

router.get('/info/:teamId', async (req, res) => {
  const { teamId } = req.params;

  const key = String(teamId).toLowerCase();

  cacheRoute({
    res,
    key,
    field: "match/info",
    fetchData: async () => Scraper.getMatchInfo(teamId),
  });
});

export default router;
