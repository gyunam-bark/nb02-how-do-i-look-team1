import { Router } from 'express';
import { CurationController } from '../controllers/curation-controller.js';

const router = Router();

router.post('/styles/:styleId', CurationController.createCuration); //큐레이팅 등록
router.put('/:curationId', CurationController.updateCuration); //큐레이팅 수정
router.delete('/:curationId', CurationController.deleteCuration); //큐레이팅 삭제


export default router;