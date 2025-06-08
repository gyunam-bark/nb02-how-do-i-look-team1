import { createCommentService } from '../services/comment-services.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(req);

    return res.status(200).json({
      message: '댓글이 등록 되었습니다.',
      comment,
    });
  } catch (err) {
    next(err);
  }
};
