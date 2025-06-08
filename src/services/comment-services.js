import db from '../config/db.js';

// 답글 등록
export const createCommentService = async (req, _res, _next) => {
  const { password, content } = req.body;
  const curationId = Number(req.params.id);

  // style 비밀번호를 참조하기위해 stlye을 포함시킵니다.
  const curation = await db.curation.findUnique({
    where: { curationId },
    include: { style: true },
  });

  if (!curation) {
    const error = new Error('큐레이션이 존재하지 않습니다.');
    error.statusCode = 404;
    throw error;
  }

  if (curation.style.password !== password) {
    const error = new Error('비밀번호가 일치하지 않습니다.');
    error.statusCode = 401;
    throw error;
  }

  const existing = await db.comment.findFirst({
    where: { curationId },
  });

  if (existing) {
    const error = new Error('이미 댓글이 존재합니다.');
    error.statusCode = 409;
    throw error;
  }

  const comment = await db.comment.create({
    data: {
      content,
      password,
      curation: { connect: { curationId } },
      style: { connect: { styleId: curation.style.styleId } },
    },
  });

  return comment;
};
