# TEAM 1

**팀 위키**: [깃허브 위키](https://github.com/gyunam-bark/nb02-how-do-i-look-team1/wiki)

**팀 이슈**: [깃허브 이슈](https://github.com/gyunam-bark/nb02-how-do-i-look-team1/issues?q=is%3Aissue%20state%3Aclosed)

**팀 PR**: [깃허브 PR](https://github.com/gyunam-bark/nb02-how-do-i-look-team1/pulls?q=is%3Apr+is%3Aclosed)

## 팀원 구성

|  이름  | 역할 | 담당 업무                                                                                                                                      | 깃허브                                                                 |
| :----: | :--: | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 박규남 | 팀장 | PM, Tag API, Log Api, Health Check API, DTO 미들웨어, Global Error Handler 미들웨어, PR-디스코드 연동, 이슈-구글 시트 연동, Swagger 연동, 배포 | [https://github.com/gyunam-bark](https://github.com/gyunam-bark)       |
| 권나현 | 팀원 | Style API, Prisma Schema 설계, Seed 데이터 설계 및 작성                                                                                        | [https://github.com/kwonnahyun0125](https://github.com/kwonnahyun0125) |
| 김슬비 | 팀원 | Curation API                                                                                                                                   | [https://github.com/stella62420](https://github.com/stella62420)       |
| 김진솔 | 팀원 | Image API, Ranking API, Prisma Schema 설계                                                                                                     | [https://github.com/JINSOLdev](https://github.com/JINSOLdev5)          |
| 하상준 | 팀원 | Comment API, 비밀번호 해싱/비교 유틸리티                                                                                                       | [https://github.com/hippo8427](https://github.com/hippo8427)           |

---

## 프로젝트 소개

- 스타일 공유 및 큐레이팅 서비스 백엔드 시스템 구축

- **프로젝트 기간**: 2025.06.02 ~ 2025.06.20

```mermaid
gantt
    title How Do I Look 프로젝트
    dateFormat  YYYY-MM-DD(day)
    section 중간발표(10일)
    협업 규칙 정리       : 2025-06-02, 3d
    공통 코드 작성       : 2025-06-04, 2d
    ERD 작성             : 2025-06-02, 2d
    개인별 API 구현      : 2025-06-05, 4d
    중간발표 준비        : 2025-06-08, 2d
    DEV 서버 구축        : 2025-06-08, 2d
    중간발표             : 2025-06-10, 0d
    section 최종발표(20일)
    개인별 API 구현      : 2025-06-10, 8d
    FE 연동 및 디버깅    : 2025-06-11, 7d
    SERIVCE 서버 구축    : 2025-06-16, 3d
    팀 발표 자료 준비    : 2025-06-16, 3d
    개인 레포트 준비     : 2025-06-16, 3d
    최종 발표            : 2025-06-20, 0d
```

---

## 기술 스택

|     분류     | 사용 도구                                                                             |
| :----------: | ------------------------------------------------------------------------------------- |
|    백엔드    | node.js, express.js                                                                   |
|     ORM      | prisma                                                                                |
| 데이터베이스 | postgresql                                                                            |
|  API 문서화  | swagger                                                                               |
|  협업 도구   | git, github, discord                                                                  |
|  일정 관리   | github webhook, google run function, google apps script, google spreadsheet           |
| 설치 패키지  | dotenv, morgan, multer, cors, bcrypt, superstruct, firebase-admin, swagger-ui-express |
|   스토리지   | google firebase                                                                       |
|     배포     | render.com(프론트엔드,백엔드,데이터베이스)                                            |

---

## 백엔드 서비스 흐름

```mermaid
flowchart TD
    %% CLIENT
    FRONTEND[FRONTEND]

    %% SERVER COMPONENTS
    ROUTER[ROUTER]
    MULTER[MULTER]
    DTO[DTO]
    CONTROLLER[CONTROLLER]
    SERVICE[SERVICE]
    POSTGRESQL[POSTGRESQL]
    FIREBASE[FIREBASE]
    ERROR_HANDLER[GLOBAL_ERROR_HANDLER]

    %% REQUEST FLOW
    FRONTEND -->|HTTP_REQUEST| ROUTER
    ROUTER --> MULTER
    MULTER --> DTO
    ROUTER --> DTO
    DTO --> CONTROLLER
    CONTROLLER --> SERVICE
    SERVICE --> |UPLOAD| FIREBASE
    SERVICE --> POSTGRESQL

    %% RESPONSE FLOW
    POSTGRESQL --> SERVICE
    FIREBASE --> |URL| SERVICE
    CONTROLLER -->|SUCCESS_RESPONSE| FRONTEND

    %% ERROR HANDLING
    DTO -->|VALIDATION_ERROR| ERROR_HANDLER
    CONTROLLER -->|CONTROLLER_ERROR| ERROR_HANDLER
    ERROR_HANDLER -->|ERROR_RESPONSE| FRONTEND
```

## 팀원별 구현 기능 상세

### 박규남

![GYUNAM_PREVIEW](https://github.com/user-attachments/assets/2c8773c5-30e4-41fd-9b9a-a3b709cfeb02)

- [개인 개발 보고서](https://github.com/gyunam-bark/nb02-how-do-i-look-report)

**CI/CD**

- Github Issue 와 Google Spreadsheet 연동

  - Issue 생성 시 팀 Gantt 시트 실시간 업데이트를 위한 연동
  - [이슈 템플릿 문서](./.github/ISSUE_TEMPLATE/todo-template.md)
  - Github Issue -> Google Run Function
  - Google Run Function(Node.js, Axios) -> Google Apps Script
  - Google Apps Script -> Google Spreadsheet

- Github PR 과 Discord 연동

  - PR 생성 시 팀 디스코드에 알림(@맨션) 을 하기 위한 연동
  - [PR 템플릿 문서](./.github/PULL_REQUEST_TEMPLATE.md)
  - [PR 깃허브 액션](./.github/workflows/pr-to-discord.yml)
  - Github PR -> Github Actions
  - Github Actions -> Discord

**API**

- Tag(/tags)

  - 태그 목록을 받기 위한 API
  - [라우터 코드](./src/routes/tag-route.js)
  - [컨트롤러 코드](./src/controllers/tag-controller.js)
  - [서비스 코드](./src/services/tag-service.js)
  - 요청 예시

    ```json

    ```

  - 응답 예시
    ```json
    {
      "tags": ["string"]
    }
    ```

- Log(/logs)

  - 데이터베이스에 저장된 에러 로그 목록을 받기 위한 API
  - [라우터 코드](./src/routes/log-route.js)
  - [컨트롤러 코드](./src/controllers/log-controller.js)
  - [서비스 코드](./src/services/log-service.js)
  - [스키마](./prisma/schema.prisma#L118-L126)
  - 요청 예시

    ```json

    ```

  - 응답 예시
    ```json
    {
      "totalItemCount": 0,
      "data": [
        {
          "id": 1,
          "ip": "string",
          "url": "string",
          "method": "string",
          "statusCode": "string",
          "message": "string",
          "createdAt": "2025-06-18T01:02:32.664Z"
        }
      ]
    }
    ```

- Health Check(/)

  - 서버 헬스체크를 위한 API
  - [라우터 코드](./src/routes/root-route.js)
  - [컨트롤러 코드](./src/controllers/root-controller.js)
  - 요청 예시

    ```json

    ```

  - 응답 예시

    ```json
    {
      "status": "OK",
      "uptime": 0,
      "timestamp": "2025-06-18T01:02:32.664Z"
    }
    ```

**MIDDLEWARE**

- DTO

  - 파라미터를 검증하고, 필요에 따라 형변환을 하여 전달하기 위한 미들웨어
  - [미들웨어 코드](./src/middlewares/dto-middleware.js)
  - 각각의 파라미터 검증 후 req.validated 객체로 저장하여 Controller 에 전달
  - 에러 발생 시 Global Error Handler 로 에러 전달

- Global Error Handler
  - 발생하는 모든 에러 상황에 메세지를 반환하기 위한 미들웨어
  - [미들웨어 코드](./src/middlewares/error-middleware.js)
  - 표준 statusCode 기반(MDN 기준)
  - Service 반환 객체와 Dev 반환 객체가 다름

**DEPLOY**

- Swagger 연동

  - API 테스트를 위한 Swagger 연동
  - [라우터 코드](./src/routes/doc-route.js)
  - [미들웨어 코드](./src/middlewares/swagger-middleware.js)
  - [OPENAPI.JSON](./openapi.json)
  - API 명세서 바탕으로 openapi.json 정리

- 배포
  - RENDER(front-end, back-end, postgresql)
    - main 브랜치 커밋 연동
  - GODADDY(\*.nbo2-howdoilook.com)
  - DNS
    | 분류 | CNAME / A |
    | :----: | :----: |
    | 프론트엔드 | www |
    | 백엔드 | api |

### 권나현

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- [개인 개발 보고서]()

- 기능 1

  - 세부설명 1
  - 세부설명 2

- 기능 2
  - 세부설명 1

### 김슬비

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- [개인 개발 보고서]()

- 기능 1

  - 세부설명 1
  - 세부설명 2

- 기능 2
  - 세부설명 1

### 김진솔

(자신이 개발한 기능에 대한 사진이나 gif 파일 첨부)

- [개인 개발 보고서]()

- 기능 1

  - 세부설명 1
  - 세부설명 2

- 기능 2
  - 세부설명 1

### 하상준

- [개인 개발 보고서](https://github.com/hippo8427/how-do-i-look-report)

**API**

- Comment(/comments)

  - 큐레이션에 답글을 달기 위한 API
  - [라우터 코드](./src/routes/comment-route.js)
  - [컨트롤러 코드](./src/controllers/comment-controller.js)
  - [서비스 코드](./src/services/comment-service.js)

  - 요청 예시

    ```json
    {
      "content": "string",
      "password": "string"
    }
    ```

  - 응답 예시
    ```json
    {
      "id": 123,
      "nickname": "string",
      "content": "string",
      "createdAt": "2024-02-22T07:47:49.803Z"
    }
    ```

**MIDDLEWARE/UTIL**

- PASSWORD HASHING (비밀번호 단방향 암호화)

  - 보안을 위해 **답글 등록 시 `password` 필드**를 bcrypt를 사용해 단방향 해싱 처리
  - [미들웨어 코드](./src/middlewares/bcrypt-middleware.js)

    - [해싱 유틸 코드](./src/utils/hash-password.js)

  - **수정/삭제 시 `password` 검증**을 위해  
    요청의 평문 비밀번호와 저장된 해시된 비밀번호를 비교

  - [인증 유틸 코드](./src/utils/compare-password.js)

- **POST** 사용 예시

```js
import { hashPasswordMiddleware } from '../middlewares/bcrypt-middleware.js';

router.post('/', validateRequest(createStyleSchema), hashPasswordMiddleware, StyleController.createStyle);
```

- **PUT/DELETE** 사용 예시

```js
import { comparePassword } from '../utils/compare-password.js';

const isMatch = await comparePassword(plainPassword, hashedPassword);
if (!isMatch) {
  const error = new Error();
  error.statusCode = 403;
  throw error;
}
```

---

## 파일 구조

```bash
NB02-HOW-DO-I-LOOK-TEAM1
┣ .github
┃ ┣ ISSUE_TEMPLATE
┃ ┃ ┣ todo-template.md
┃ ┣ workflows
┃ ┃ ┣ pr-to-discord.yml
┃ ┣ PULL_REQUEST_TEMPLATE.md
┣ prisma
┃ ┣ schema.prisma
┃ ┣ seed.js
┣ src
┃ ┣ config
┃ ┃ ┣ db.js
┃ ┃ ┣ firebase-admin.js
┃ ┃ ┣ uploads-path.js
┃ ┣ controllers
┃ ┃ ┣ comment-controller.js
┃ ┃ ┣ curation-controller.js
┃ ┃ ┣ image-controller.js
┃ ┃ ┣ log-controller.js
┃ ┃ ┣ rank-controller.js
┃ ┃ ┣ root-controller.js
┃ ┃ ┣ style-controller.js
┃ ┃ ┣ tag-controller.js
┃ ┣ middlewares
┃ ┃ ┣ bcrypt-middleware.js
┃ ┃ ┣ dto-middleware.js
┃ ┃ ┣ error-middleware.js
┃ ┃ ┣ multer-middleware.js
┃ ┃ ┣ swagger-middleware.js
┃ ┣ routes
┃ ┃ ┣ comment-route.js
┃ ┃ ┣ curation-route.js
┃ ┃ ┣ doc-route.js
┃ ┃ ┣ image-route.js
┃ ┃ ┣ log-route.js
┃ ┃ ┣ rank-route.js
┃ ┃ ┣ root-route.js
┃ ┃ ┣ style-route.js
┃ ┃ ┣ tag-route.js
┃ ┣ services
┃ ┃ ┣ comment-service.js
┃ ┃ ┣ curation-service.js
┃ ┃ ┣ image-service.js
┃ ┃ ┣ log-service.js
┃ ┃ ┣ rank-service.js
┃ ┃ ┣ style-service.js
┃ ┃ ┣ tag-service.js
┃ ┣ utils
┃ ┃ ┣ compare-password.js
┃ ┃ ┣ hash-password.js
┃ ┣ server.js
┣ .env.example
┣ .gitignore
┣ .prettierrc
┣ eslint.confing.js
┣ index.js
┣ openapi.json
┣ package-lock.json
┣ package.json
┣ README.md
```

---

## 구현 홈페이지

**프론트엔드**: [www.nb02-howdoilook.com](www.nb02-howdoilook.com)

**백엔드**: [api.nb02-howdoilook.com](api.nb02-howdoilook.com)

---

## 프로젝트 회고록

(제작한 발표자료 링크 혹은 첨부파일 첨부)
