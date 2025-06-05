<<<<<<< HEAD
// 서버 실행

import dotenv from 'dotenv';
import Server from './src/server.js';

const main = async () => {
  dotenv.config();

  const server = new Server();
  server.run();
};

main();
=======
process.on('uncaughtException', err => {
    console.error('--- UNCAUGHT EXCEPTION! 💥 서버가 강제 종료됩니다 ---');
    console.error('에러 종류 (name):', err.name);
    console.error('에러 메시지 (message):', err.message);
    console.error('발생 위치 (stack):', err.stack);
        process.exit(1);
});

import dotenv from 'dotenv';
import { nextTick } from 'process';
dotenv.config();

const express = require('express');
const app = express();
const path = require('path'); // 예시를 위한 path 모듈

// 미들웨어 설정
app.use(express.json()); // JSON 요청 본문 파싱
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 서비스 예시

app.get('/', (req, res) => {
    res.send('서버가 정상 작동 중입니다!');
});

app.get('/test-uncaught-error', (req, res) => {
    console.log(nonExistentVariable);
    res.send('이 메시지는 보이지 않을 것입니다. 서버가 종료됩니다.');
});


>>>>>>> 9d39c4b (feat fix)
