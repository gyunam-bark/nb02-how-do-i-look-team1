import db from '../config/db.js';

// [수정] 함수명 원상 복구 (Service 접미사 추가)
export const createCurationService = async ({
  styleId,
  nickname,
  password,
  trendy,
  personality,
  practicality,
  costEffectiveness,
  content,
}) => {
  // 1. 스타일 존재 여부 확인
  const existingStyle = await db.style.findUnique({
    where: { styleId: +styleId },
  });

  if (!existingStyle) {
    throw new Error('해당 스타일을 찾을 수 없습니다.');
  }

  // 2. 큐레이션 데이터 생성 (포맷팅 없이 Prisma 원본 객체 반환)
  const newCuration = await db.curation.create({
    data: {
      styleId: +styleId,
      nickname,
      password: password,
      trendy: +trendy,
      personality: +personality,
      practicality: +practicality,
      costEffectiveness: +costEffectiveness,
      content,
    },
  });

  return newCuration;
};

export const getCurationListService = async ({ styleId, page, pageSize, searchBy, keyword }) => {
  const parsedPage = parseInt(page || 1);
  const parsedPageSize = parseInt(pageSize || 10);

  if (parsedPage < 1 || parsedPageSize < 1) {
    throw new Error('페이지 및 페이지 크기는 1 이상의 유효한 숫자여야 합니다.');
  }

  const existingStyle = await db.style.findUnique({
    where: { styleId: +styleId },
  });
  if (!existingStyle) {
    throw new Error('해당 스타일을 찾을 수 없습니다.');
  }

  // 2. 검색 조건
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

  // 3. 총 아이템 개수 및 큐레이션 목록 조회 
  const [totalItemCount, curations] = await Promise.all([
    db.curation.count({ where }),
    db.curation.findMany({
      where,
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        comments: true, 
      },
    }),
  ]);

  // 4. 총 페이지 수 계산
  const totalPages = Math.ceil(totalItemCount / parsedPageSize);

  // 5. 페이지네이션 정보와 함께 원본 데이터 반환
  return {
    currentPage: parsedPage,
    totalPages,
    totalItemCount,
    data: curations,
  };
};

export const updateCurationService = async (
  curationId,
  { password, trendy, personality, practicality, costEffectiveness, content, nickname }
) => {
  // 1. 큐레이팅 존재 여부 확인
  const existingCuration = await db.curation.findUnique({
    where: { curationId: +curationId },
  });

  if (!existingCuration) {
    throw new Error('큐레이팅을 찾을 수 없습니다.');
  }
  // 2. 비밀번호 일치 확인
  if (existingCuration.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  // 3. 큐레이팅 데이터 업데이트
  const updatedCuration = await db.curation.update({
    where: { curationId: +curationId },
    data: {
      nickname: nickname !== undefined ? nickname : existingCuration.nickname,
      trendy: +trendy,
      personality: +personality,
      practicality: +practicality,
      costEffectiveness: +costEffectiveness,
      content,
      updatedAt: new Date(),
    },
  });

  return updatedCuration;
};

export const deleteCurationService = async (curationId, password) => {
  // 1. 큐레이팅 존재 여부 확인
  const existingCuration = await db.curation.findUnique({
    where: { curationId: +curationId },
  });

  if (!existingCuration) {
    throw new Error('큐레이팅을 찾을 수 없습니다.');
  }

  // 2. 비밀번호 일치 확인
  if (existingCuration.password !== password) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }

  // 3. 큐레이팅 삭제
  await db.curation.delete({ where: { curationId: +curationId } });

  // 4. 삭제 성공 메시지 반환 
  return { message: '큐레이팅 삭제 성공' };
};