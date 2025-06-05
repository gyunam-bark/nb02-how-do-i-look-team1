import db from '../config/db.js';

export const getTagList = async () => {
  // 태그 목록
  const tagList = await db.tag.findMany();

  // 태그 목록의 총 갯수
  const totalCount = await db.tag.count();

  return {
    totalCount: totalCount,
    list: tagList,
  };
};
