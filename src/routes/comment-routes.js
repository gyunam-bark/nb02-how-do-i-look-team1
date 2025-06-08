import express from 'express';

const router = express.Router();

import { createComment } from '../controllers/comment-controllers.js';

router.post('/curations/:id/comments', createComment); // 댓글 등록

export default router;
