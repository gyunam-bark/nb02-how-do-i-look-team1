import { Router } from 'express';
import { StyleController } from '../controllers/style-controllers.js';

const router = Router();

router.post('/', StyleController.createStyle); // 스타일 등록
router.get('/', StyleController.getStyles); // 스타일 목록
router.get('/:styleId', StyleController.getStyleDetail); // 스타일 상세
router.put('/:styleId', StyleController.updateStyle); // 스타일 수정
router.delete('/:styleId', StyleController.deleteStyle); // 스타일 삭제

export default router;
