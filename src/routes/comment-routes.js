import express from 'express';

const router = express.Router();

import { updateComment, deleteComment } from '../controllers/comment-controllers.js';

router.put('/:commentId', updateComment); // 답글 수정
router.delete('/:commentId', deleteComment); // 답글 삭제

export default router;
