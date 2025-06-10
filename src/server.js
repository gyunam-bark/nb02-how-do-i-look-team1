import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from 'fs';

import styleRouter from './routes/style-routes.js';

import curationRouter from './routes/curation-routes.js';
import imageRouter from './routes/image-route.js';
import comment from './routes/comment-routes.js';
import tagRouter from './routes/tag-routers.js';
import rankRouter from './routes/rank-route.js'

import errorHandler from './middlewares/error-middleware.js';
import uploadsDir from './config/uploads-path.js';

export default class Server {
  #app;
  #port;

  constructor() {
    this.#app = express();
    this.#port = process.env.EXPRESS_PORT || 5000;

    this.#initializePreMiddlewares();
    this.#initializeRouters();
    this.#initializePostMiddlewares();
  }

  #initializePreMiddlewares() {
    // uploads 폴더 없으면 생성
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
      console.log(`uploads 폴더 생성`);
    }

    this.#app.use(cors());
    this.#app.use(morgan('dev'));
    this.#app.use(express.json());

    // 정적 파일 제공
    this.#app.use('/images/upload', express.static(uploadsDir));
  }

  // 라우터 등록
  // this.#app.use('/api/users', userRouter);
  #initializeRouters() {
    this.#app.use('/images', imageRouter);
    this.#app.use('/ranking', rankRouter)
    this.#app.use('/tags', tagRouter);
    this.#app.use('/styles', styleRouter);
    this.#app.use('/curations', curationRouter); 
    this.#app.use(comment);
  }

  // 에러 핸들러 등록
  // this.#app.use(errorHandler);
  #initializePostMiddlewares() {
    this.#app.use(errorHandler);
  }

  run() {
    this.#app.listen(this.#port, () => {
      console.log(`server is running at http://localhost:${this.#port}`);
    });
  }
}
