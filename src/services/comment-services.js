import db from '../config/db.js';

// 답글 등록
export const createCommentService = async ({password, content, curationId}) => {
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
    },
  });

  return {
    ...comment,
    nickname: curation.style.nickname,
  };
};

// 답글 수정
export const updateCommentService = async ({content, password, commentId}) => {
  // 닉네임을 가져오기위해 style을 포함시킵니다.
  const comment = await db.comment.findFirst({
    where: { commentId },
    include: {
      curation: {
        include: { style: true },
      },
    },
  });

  if (!comment) {
    const error = new Error('존재하지 않습니다');
    error.statusCode = 404;
    throw error;
  }

  if (comment.password !== password) {
    const error = new Error('비밀번호가 틀렸습니다');
    error.statusCode = 401;
    throw error;
  }

  const updated = await db.comment.update({
    where: { commentId: comment.commentId },
    data: { content },
  });

  return {
    ...updated,
    nickname: comment.curation.style.nickname,
  };
};

// 답글 삭제
export const deleteCommentService = async ({password, commentId}) => {
 

  const comment = await db.comment.findFirst({
    where: { commentId },
  });

  if (!comment) {
    const error = new Error('존재하지 않습니다');
    error.statusCode = 404;
    throw error;
  }

  if (comment.password !== password) {
    const error = new Error('비밀번호가 틀렸습니다');
    error.statusCode = 401;
    throw error;
  }

  await db.comment.delete({
    where: { commentId: comment.commentId },
  });

  return { message: '답글 삭제 성공' };
};
