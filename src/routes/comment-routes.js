import express from 'express';

const router = express.Router();

import { CommentController } from '../controllers/comment-controllers.js';

router.put('/:commentId', CommentController.updateComment); // 답글 수정
router.delete('/:commentId', CommentController.deleteComment); // 답글 삭제

export default router;
