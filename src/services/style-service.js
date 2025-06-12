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

export const createCuration = async ({ styleId, nickname, password, trendy, personality, practicality, costEffectiveness, content }) => {
  const existingStyle = await db.style.findUnique({
    where: { styleId: +styleId },
  });
  if (!existingStyle) {
    throw new Error('스타일을 찾을 수 없습니다.');
  }

  const newCuration = await db.curation.create({
    data: {
      styleId: +styleId,
      nickname,
      password: password,
      trendy: +trendy,
      personality: +personality,
      practicality: +practicality,
      costEffectiveness: +costEffectiveness,
      content: content?.trim(),
    },
    include: {
      comments: true,
      style: {
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          styleImages: { include: { image: true } },
          _count: { select: { curations: true } },
        },
      },
    },
  });

  return newCuration;
};

// 스타일의 큐레이션 목록 조회
export const getCurationList = async ({ styleId, page, pageSize, searchBy, keyword }) => {
  const parsedPage = parseInt(page || 1);
  const parsedPageSize = parseInt(pageSize || 10);

  if (parsedPage < 1 || parsedPageSize < 1) {
    throw new Error('페이지 및 페이지 크기는 1 이상의 유효한 숫자여야 합니다.');
  }

  const existingStyle = await db.style.findUnique({
    where: { styleId: +styleId },
  });
  if (!existingStyle) {
    throw new Error('스타일을 찾을 수 없습니다.');
  }

  let where = { styleId: +styleId };
  if (searchBy && keyword) {
    if (searchBy === 'nickname') {
      where.nickname = { contains: keyword, mode: 'insensitive' };
    } else if (searchBy === 'content') {
      where.content = { contains: keyword, mode: 'insensitive' };
    } else {
      throw new Error('유효하지 않은 검색 기준입니다.');
    }
  }

  const [totalItemCount, curations] = await Promise.all([
    db.curation.count({ where }),
    db.curation.findMany({
      where,
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true,
        style: {
          include: {
            categories: true,
            styleTags: { include: { tag: true } },
            styleImages: { include: { image: true } },
            _count: { select: { curations: true } },
          },
        },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalItemCount / parsedPageSize);
  const currentPage = parsedPage;

  return {
    currentPage,
    totalPages,
    totalItemCount,
    data: curations,
  };
};
