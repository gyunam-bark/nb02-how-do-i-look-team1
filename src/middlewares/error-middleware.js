// 상태 코드에 따른 메시지 정의 객체
const statusMessages = {
  // 1xx: 정보 응답
  100: 'Continue', // 요청의 일부를 받았으며 나머지를 계속 요청하라는 의미
  101: 'Switching Protocols', // 프로토콜 전환을 허용함
  102: 'Processing', // 서버가 요청을 수신했으며 처리 중 (WebDAV)
  103: 'Early Hints', // 본 응답 전에 미리 헤더 힌트를 제공

  // 3xx: 리다이렉션
  300: 'Multiple Choices', // 요청에 여러 응답이 가능함
  301: 'Moved Permanently', // 요청한 리소스가 영구적으로 이동됨
  302: 'Found', // 요청한 리소스가 일시적으로 다른 URI에 존재함
  303: 'See Other', // 다른 URI를 통해 리소스를 요청하라는 의미
  304: 'Not Modified', // 캐시된 리소스가 변경되지 않음
  305: 'Use Proxy', // 요청은 프록시를 통해 접근해야 함 (현재는 거의 사용 안 함)
  306: 'Unused', // 예약 상태 코드 (현재 사용되지 않음)
  307: 'Temporary Redirect', // 임시로 리다이렉트됨. 메서드는 변경되지 않음
  308: 'Permanent Redirect', // 영구적으로 리다이렉트됨. 메서드도 유지됨

  // 4xx: 클라이언트 오류
  400: 'Bad Request', // 잘못된 요청
  401: 'Unauthorized', // 인증 필요
  402: 'Payment Required', // 결제 필요 (실제로 거의 사용되지 않음)
  403: 'Forbidden', // 서버가 요청을 이해했지만 거부함
  404: 'Not Found', // 요청한 리소스를 찾을 수 없음
  405: 'Method Not Allowed', // 지원하지 않는 HTTP 메서드 사용
  406: 'Not Acceptable', // 요청한 리소스가 허용된 형식이 아님
  407: 'Proxy Authentication Required', // 프록시 인증 필요
  408: 'Request Timeout', // 요청 시간 초과
  409: 'Conflict', // 요청 충돌 (예: 중복 데이터)
  410: 'Gone', // 리소스가 영구적으로 삭제됨
  411: 'Length Required', // Content-Length 헤더가 필요함
  412: 'Precondition Failed', // 사전 조건 실패
  413: 'Payload Too Large', // 요청 본문이 너무 큼
  414: 'URI Too Long', // URI가 너무 김
  415: 'Unsupported Media Type', // 지원하지 않는 미디어 타입
  416: 'Range Not Satisfiable', // 요청한 범위를 처리할 수 없음
  417: 'Expectation Failed', // Expect 헤더 요구사항 실패
  418: 'I’m a teapot', // 나는 찻주전자입니다 (개그용, RFC 2324)
  421: 'Misdirected Request', // 잘못된 서버로 라우팅된 요청
  422: 'Unprocessable Entity', // 구문은 맞지만 처리 불가 (예: 유효성 실패)
  426: 'Upgrade Required', // 클라이언트가 프로토콜 업그레이드 필요
  428: 'Precondition Required', // 조건부 요청이 필요함
  429: 'Too Many Requests', // 너무 많은 요청을 보냄 (Rate limiting)
  431: 'Request Header Fields Too Large', // 헤더 필드가 너무 큼
  451: 'Unavailable For Legal Reasons', // 법적 이유로 접근 불가

  // 5xx: 서버 오류
  500: 'Internal Server Error', // 내부 서버 오류
  501: 'Not Implemented', // 서버가 해당 기능을 지원하지 않음
  502: 'Bad Gateway', // 게이트웨이/프록시 서버 오류
  503: 'Service Unavailable', // 서버가 일시적으로 사용 불가
  504: 'Gateway Timeout', // 게이트웨이 응답 지연
  505: 'HTTP Version Not Supported', // 지원되지 않는 HTTP 버전 사용
  506: 'Variant Also Negotiates', // 콘텐츠 협상 오류
  507: 'Insufficient Storage', // 저장소 부족 (WebDAV)
  508: 'Loop Detected', // 무한 루프 감지됨 (WebDAV)
  510: 'Not Extended', // 추가 확장이 필요함
  511: 'Network Authentication Required', // 네트워크 인증 필요 (예: Wi-Fi 로그인)
};

// DEV 용 에러 반환 메서드
const responseErrorDev = (error = {}, req = {}, statusCode = 500, message = '') => {
  const response = {
    success: false,
    time: new Date().toISOString(),
    statusCode,
    message,
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
  const serviceMessage = statusCode >= 500 ? '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' : message;

  const response = {
    success: false,
    statusCode,
    message: serviceMessage,
  };

  res.status(statusCode).json(response);
};

// 글로벌 에러 핸들러
const errorHandler = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message;

  // 비정상적인 statusCode 처리
  if (statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }

  if (!message) {
    message = statusMessages[statusCode] || 'Internal Server Error';
  }

  // DEV 로그
  responseErrorDev(error, req, statusCode, message);

  // 사용자 응답
  responseErrorService(res, statusCode, message);
};

export default errorHandler;
