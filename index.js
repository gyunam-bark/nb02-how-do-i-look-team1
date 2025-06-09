// 서버 실행

import dotenv from 'dotenv';
import Server from './src/server.js';

const main = async () => {
  dotenv.config();

  const server = new Server();
  server.run();
};

main();
