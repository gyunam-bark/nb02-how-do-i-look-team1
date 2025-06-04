// DEV 용 에러 반환 메서드
const responseErrorDev = (error = {}, req = {}, statusCode = 500, message = '') => {
  const response = {
    success: false,
    time: new Date().toISOString(),
    statusCode: statusCode,
    message: message,
    name: error.name,
    stack: error.stack,
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    params: req.params,
    query: req.query,
    body: req.body,
    headers: req.headers,
  };

  console.error(response);
};

// SERVICE 용 에러 반환 메서드
const responseErrorService = (res = {}, statusCode = 500, message = '') => {
  const serviceMessage = message;
  // 500번 대라면 사용자는 단순 서버 오류로만 표기
  if (statusCode >= 500) {
    message = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  }

  const response = {
    success: false,
    statusCode: statusCode,
    message: serviceMessage,
  };

  res.status(statusCode).json(response);
};

// 글로벌 에러 핸들러
const errorHandler = (error, req, res, _next) => {
  // 기본 상태코드 및 메시지 설정
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // 세분화 처리
  switch (statusCode) {
    // 100번 대
    case 100:
      message = message || 'Continue';
      break;
    case 101:
      message = message || 'Switching Protocols';
      break;
    case 102:
      message = message || 'Processing';
      break;
    // 300번 대
    case 300:
      message = message || 'Multiple Choices';
      break;
    case 301:
      message = message || 'Moved Permanently';
      break;
    case 302:
      message = message || 'Found';
      break;
    case 303:
      message = message || 'See Other';
      break;
    case 304:
      message = message || 'Not Modified';
      break;
    case 307:
      message = message || 'Temporary  Redirect';
      break;
    case 308:
      message = message || 'Permanent Redirect';
      break;
    // 400번 대
    case 400:
      message = message || 'Bad Request';
      break;
    case 401:
      message = message || 'Unauthorized';
      break;
    case 403:
      message = message || 'Forbidden';
      break;
    case 404:
      message = message || 'Not Found';
      break;
    case 405:
      message = message || 'Method Not Allowed';
      break;
    case 409:
      message = message || 'Conflict';
      break;
    case 410:
      message = message || 'Gone';
      break;
    case 415:
      message = message || 'Unsupported Media Type';
      break;
    case 422:
      message = message || 'Unprocessable Entity';
      break;
    case 429:
      message = message || 'Too Many Requests';
      break;
    // 500번 대
    case 500:
      message = message || 'Internal Server Error';
      break;
    case 501:
      message = message || 'Not Implemented';
      break;
    case 502:
      message = message || 'Bad Gateway';
      break;
    case 503:
      message = message || 'Service Unavailable';
      break;
    case 504:
      message = message || 'Gateway Timeout';
      break;
    default:
      // statusCode 가 비표준으로 발생한 경우
      if (statusCode < 100 || statusCode > 599) {
        statusCode = 500;
        message = 'Unknown Error';
      }
      break;
  }

  // DEV
  // 일단은 console.error 로 서버에 표시
  // 차후 연동할 수 있는 곳이 있으면 연동
  responseErrorDev(error, req, statusCode, message);

  // SERVICE
  responseErrorService(res, statusCode, message);
};

export default errorHandler;
