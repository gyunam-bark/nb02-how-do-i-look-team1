import db from '../config/db.js';

// 스타일 등록
export const createStyle = async ({ nickname, title, content, password, categories, tags, images }) => {
  const newStyle = await db.style.create({
    data: {
      nickname,
      title,
      content,
      password,
      categories: {
        create: categories || [],
      },
      styleTags: {
        create: tags?.map(({ tagId }) => ({ tagId })) || [],
      },
      images: {
        create: images?.map(({ url }) => ({ imageUrl: url })) || [],
      },
    },
    include: {
      categories: true,
      styleTags: { include: { tag: true } },
      images: true,
    },
  });
  return newStyle;
};

// 스타일 목록조회
export const getStyleList = async () => {
  const styleList = await db.style.findMany({
    include: {
      categories: true,
      styleTags: { include: { tag: true } },
      images: true,
    },
  });

  const totalCount = await db.style.count();

  return {
    totalCount,
    list: styleList,
  };
};

// 스타일 상세조회
export const getStyleDetail = async (styleId) => {
  // 조회수 증가
  await db.style.update({
    where: { styleId: +styleId },
    data: { viewCount: { increment: 1 } },
  });

  const style = await db.style.findUnique({
    where: { styleId: +styleId },
    include: {
      categories: true,
      styleTags: { include: { tag: true } },
      images: true,
      curations: true,
      comments: true,
    },
  });
  return style;
};

// 스타일 수정
export const updateStyle = async (styleId, { title, content, categories, tags, images }) => {
  const updatedStyle = await db.style.update({
    where: { styleId: +styleId },
    data: {
      title,
      content,
      categories: { deleteMany: {}, create: categories || [] },
      styleTags: { deleteMany: {}, create: (tags || []).map(({ tagId }) => ({ tagId })) },
      images: { deleteMany: {}, create: (images || []).map(({ url }) => ({ imageUrl: url })) },
      updatedAt: new Date(),
    },
    include: {
      categories: true,
      styleTags: { include: { tag: true } },
      images: true,
    },
  });
  return updatedStyle;
};

// 스타일 삭제
export const deleteStyle = async (styleId) => {
  await db.style.delete({ where: { styleId: +styleId } });
  return { message: '스타일이 삭제되었습니다.' };
};
