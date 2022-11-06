import { Router } from 'express';

import Scraper from '../scraper';
import { cacheRoute } from '../util/cacheRoute';

const router = Router();

router.get('/info/:matchId', async (req, res) => {
  const { matchId } = req.params;

  const key = String(matchId).toLowerCase();

  cacheRoute({
    res,
    key,
    field: "match/info",
    fetchData: async () => Scraper.getMatchInfo(matchId),
  });
});

export default router;
