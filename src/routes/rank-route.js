import { Router } from 'express';
import RankController from '../controllers/rank-controller.js';

const router = Router();

const rankController = new RankController();

router.get('/', rankController.getRankingList.bind(rankController));

export default router;
