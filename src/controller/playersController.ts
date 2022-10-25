import { Router } from 'express';

import Scraper from '../scraper';
import { cacheRoute } from '../util/cacheRoute';

const router = Router();

router.get("/search/:playerName", async (req, res) => {
  const { playerName } = req.params;

  const key = String(playerName).toLowerCase();

  cacheRoute({
    res,
    key,
    field: "player/search",
    fetchData: async () => {
      const search = await Scraper.search(playerName);

      return { players: search.players };
    },
  });
});

router.get("/info/:playerId", async (req, res) => {
  const { playerId } = req.params;

  const key = String(playerId).toLowerCase();

  cacheRoute({
    res,
    key,
    field: "player/info",
    fetchData: async () => Scraper.getPlayerInfo(playerId),
  });
});

export default router;
