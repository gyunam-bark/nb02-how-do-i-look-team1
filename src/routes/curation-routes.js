import { Router } from 'express';
import { CurationController } from '../controllers/curation-controller.js';
import { CommentController } from '../controllers/comment-controller.js';
import { validateRequest, createCommentSchema } from '../middlewares/dto-middleware.js';

const router = Router();

router.post('/styles/:styleId', CurationController.createCuration); //큐레이팅 등록
router.put('/:curationId', CurationController.updateCuration); //큐레이팅 수정
router.delete('/:curationId', CurationController.deleteCuration); //큐레이팅 삭제

router.post('/:curationId/comments', validateRequest(createCommentSchema), CommentController.createComment); // 답글 등록

export default router;
