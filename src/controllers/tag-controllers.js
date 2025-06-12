import TagService from '../services/tag-services.js';

export default class TagController {
  static handleGetTagList = async (_req, res, next) => {
    try {
      const tagList = await TagService.getTagList();

      res.status(200).json({
        ...tagList,
      });
    } catch (error) {
      next(error);
    }
  };
}
