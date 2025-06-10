import express from 'express';
import { handleGetTagList } from '../controllers/tag-controllers.js';

const tagRouter = express.Router();

tagRouter.get('/', handleGetTagList);

export default tagRouter;
