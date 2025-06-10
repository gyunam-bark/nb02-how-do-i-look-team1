import { getTagList } from '../services/tag-services.js';

export const handleGetTagList = async (_req, res, next) => {
  try {
    const tagList = await getTagList();

    res.status(200).json({
      ...tagList,
    });
  } catch (error) {
    next(error);
  }
};
