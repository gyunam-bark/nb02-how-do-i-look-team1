import express from 'express';

const router = express.Router();

import { createComment, updateComment, deleteComment } from '../controllers/comment-controllers.js';

router.post('/curations/:id/comments', createComment); // 댓글 등록
router.put('/comments/:id', updateComment); // 댓글 수정
router.delete('/comments/:id', deleteComment); // 댓글 삭제

export default router;
