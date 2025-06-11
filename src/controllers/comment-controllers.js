import { createCommentService, updateCommentService, deleteCommentService } from '../services/comment-services.js';

export class CommentController {
  // 댓글 등록
  static async createComment(req, res, next) {
    try {
      const comment = await createCommentService(req);

      res.status(201).json({
        id: comment.commentId,
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }

  // 댓글 수정 
  static async updateComment(req, res, next) {
    try {
      const updated = await updateCommentService(req);

      res.status(200).json({
        id: updated.commentId,
        nickname: updated.nickname,
        content: updated.content,
        createdAt: updated.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }

  // 댓글 삭제 
  static async deleteComment(req, res, next) {
    try {
      const deleted = await deleteCommentService(req);

      res.status(200).json(deleted);
    } catch (err) {
      next(err);
    }
  }
}
