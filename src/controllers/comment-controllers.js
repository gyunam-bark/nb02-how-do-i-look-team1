import { createCommentService, updateCommentService, deleteCommentService } from '../services/comment-services.js';

export const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(req);

    return res.status(200).json({
      id: comment.commentId,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const updated = await updateCommentService(req);

    return res.status(200).json({
      id: updated.commentId,
      nickname: updated.nickname,
      content: updated.content,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const deleted = await deleteCommentService(req);

    return res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
