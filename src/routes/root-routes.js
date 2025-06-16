import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const rootRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

rootRouter.use(express.static(path.join(__dirname, '../../public')));

rootRouter
  .route('/')
  // API 테스터
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
  });

export default rootRouter;
