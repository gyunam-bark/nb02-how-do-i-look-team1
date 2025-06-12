import { Router } from 'express';
import { StyleController } from '../controllers/style-controller.js';
import {
  validateRequest,
  createStyleSchema,
  getStyleListSchema,
  getStyleDetailSchema,
  updateStyleSchema,
  deleteStyleSchema
} from '../middlewares/dto-middleware.js';

const router = Router();

router.post('/', validateRequest(createStyleSchema), StyleController.createStyle);                 // 등록
router.get('/', validateRequest(getStyleListSchema), StyleController.getStyleList);                  // 목록
router.get('/:styleId', validateRequest(getStyleDetailSchema), StyleController.getStyleDetail);   // 상세
router.put('/:styleId', validateRequest(updateStyleSchema), StyleController.updateStyle);          // 수정
router.delete('/:styleId', validateRequest(deleteStyleSchema), StyleController.deleteStyle);       // 삭제

export default router;

