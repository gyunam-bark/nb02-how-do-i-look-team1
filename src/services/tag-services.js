import db from '../config/db.js';

export default class TagService {
  static getTagList = async () => {
    const [totalItemCount, tagList] = await Promise.all([db.tag.count(), db.tag.findMany()]);

    // tagId -> id 로 변환
    const formattedTagList = tagList.map(({ tagId, ...other }) => ({
      id: tagId,
      ...other,
    }));

    return {
      totalItemCount: totalItemCount,
      data: formattedTagList,
    };
  };
}
