import { createCommentService } from '../services/comment-services.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(req);

    return res.status(200).json({
      comment: {
        commentId: comment.commentId,
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};
