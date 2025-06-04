import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

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
    this.#app.use(cors());
    this.#app.use(morgan('dev'));
    this.#app.use(express.json());
  }

  // 라우터 등록
  // this.#app.use('/api/users', userRouter);
  #initializeRouters() {}

  // 에러 핸들러 등록
  // this.#app.use(errorHandler);
  #initializePostMiddlewares() {}

  run() {
    this.#app.listen(this.#port, () => {
      console.log(`server is running at http://localhost:${this.#port}`);
    });
  }
}
