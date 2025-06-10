import { Router } from 'express';
import { CurationController } from '../controllers/curation-controller.js';

const router = Router();

router.post('/styles/:styleId/curations', CurationController.createCuration); //큐레이팅 등록
router.get('/styles/:styleId/curations', CurationController.getCurationsByStyleId); // 큐레이팅 목록 조회
router.put('/:curationId', CurationController.updateCuration); //큐레이팅 수정
router.delete('/:curationId', CurationController.deleteCuration); //큐레이팅 삭제

export default router;