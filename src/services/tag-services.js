import db from '../config/db.js';

export const getTagList = async () => {
  // 태그 목록
  const tagList = await db.tag.findMany();

  // tagId -> id 로 변환
  const formattedTagList = tagList.map(({ tagId, ...other }) => ({
    id: tagId,
    ...other,
  }));

  // 태그 목록의 총 갯수
  const totalItemCount = await db.tag.count();

  return {
    totalItemCount: totalItemCount,
    data: formattedTagList,
  };
};
