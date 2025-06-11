import express from 'express';
import TagController from '../controllers/tag-controllers.js';

const tagRouter = express.Router();

tagRouter.get('/', TagController.handleGetTagList);

export default tagRouter;
