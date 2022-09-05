import { Router } from 'express';

import { expireAll } from '../util/expireAll';
import { handleRoute } from '../util/handleRoute';

const router = Router();

router.get('/expire-all', (req, res) => {
  handleRoute(async () => {
    const keys = await expireAll();
    res.json({ keys });
  }, res)
});

export default router;
