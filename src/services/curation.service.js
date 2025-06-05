import db from '../config/db.js';
import bcrypt from 'bcrypt';

/**
 * 새로운 큐레이팅을 등록합니다.
 * @param {string} styleId - 큐레이팅이 속할 스타일의 ID (URL 파라미터에서 옴)
 * @param {object} curationData - 클라이언트로부터 받은 큐레이팅 데이터
 * (nickname, password, trendy, personality, practicality, costEffectiveness, content)
 * @returns {Promise<object>} 생성된 큐레이팅 객체
 * @throws {Error} 유효성 검사 실패 또는 DB 오류 시 에러 발생.
 * 이 에러 객체는 'statusCode' 속성을 포함하여 HTTP 상태 코드로 사용됩니다.
 */

async function createCuration(styleId, curationData) {
  // 데이터베이스 필드명 규칙에 따라 camelCase를 사용합니다.
  const {
    nickname,
    password,
    trendy,
    personality,
    practicality,
    costEffectiveness,
    content
  } = curationData;

    // styleId 유효성 및 존재 여부 확인
  const parsedStyleId = parseInt(styleId, 10);
  if (isNaN(parsedStyleId)) {
    // 에러 핸들러에서 statusCode로 사용할 속성을 추가 (error.statusCode)
    const error = new Error('Invalid Style ID. Style ID must be a number.');
    error.statusCode = 400; // Bad Request
    throw error;
  }

  const existingStyle = await db.style.findUnique({
    where: { id: parsedStyleId },
  });

  if (!existingStyle) {
    const error = new Error('Style not found. Curation cannot be created for a non-existent style.');
    error.statusCode = 404; // Not Found
    throw error;
  }
  // 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);
  // Prisma를 사용하여 큐레이팅 레코드 생성
    try {
    const newCuration = await db.curation.create({
      data: {
        styleId: parsedStyleId,  // 외래 키 연결
        nickname,
        password: hashedPassword, // 해싱된 비밀번호 저장
        trendy,
        personality,
        practicality,
        costEffectiveness,
        content,
      },
      // 큐레이팅 생성 후, 관련된 댓글(comments)도 함께 조회되도록 설정 (요구사항)
      include: {
        comments: true,
      },
    });
    return newCuration;
  } catch (dbError) {
    console.error('Database error during curation creation:', dbError);
    const error = new Error('Failed to create curation due to a database error.');
    error.statusCode = 500
   throw error;
  }
}

export {
  createCuration,
};