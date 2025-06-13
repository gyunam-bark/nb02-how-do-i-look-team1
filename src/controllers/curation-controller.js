import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import {
  updateCurationService,
  deleteCurationService,
} from '../services/curation-service.js';

export class CurationController {

  // 큐레이팅 수정 (PUT /curations/:curationId)
  static async updateCuration(req, res, next) {
    try {
      const { curationId } = req.params;
      const { password, trendy, personality, practicality, costEffectiveness, content, nickname } = req.body;

      const updatedCurationData = await updateCurationService(curationId, {
        password,
        trendy,
        personality,
        practicality,
        costEffectiveness,
        content,
        nickname,
      });

      res.status(200).json(updatedCurationData);
    } catch (err) {
      if (err.message === '큐레이팅을 찾을 수 없습니다.') {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === '비밀번호가 일치하지 않습니다.') {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  }

  // 큐레이팅 삭제 (DELETE /curations/:curationId)
  static async deleteCuration(req, res, next) {
    try {
      const { curationId } = req.params;
      const { password } = req.body;

      const result = await deleteCurationService(curationId, password);

      res.status(200).json(result);
    } catch (err) {
      if (err.message === '큐레이팅을 찾을 수 없습니다.') {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === '비밀번호가 일치하지 않습니다.') {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  }
}
