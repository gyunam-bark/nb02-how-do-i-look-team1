import RankService from '../services/rank-service.js';

class RankController {
  constructor() {
    this.rankService = new RankService();
  }

  async getRankingList(req, res, next) {
    try {
      const { page = 1, pageSize = 10, rankBy = 'total' } = req.query;

      const validRankBy = ['total', 'trendy', 'personality', 'practicality', 'costEffectiveness'];
      if (!validRankBy.includes(rankBy)) {
        return res.status(400).json({ message: `Invalid rankBy value: ${rankBy}` });
      }

      const result = await this.rankService.getRankingList({
        page: Number(page),
        pageSize: Number(pageSize),
        rankBy,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default RankController;
