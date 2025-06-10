import {
  object,
  optional,
  string,
  size,
  define,
  validate,
  coerce,
  number,
  boolean,
  enums,
  min,
  array,
  create,
  StructError,
} from 'superstruct';

// ----------------------------------------------------------
// CONSTANTS
// ----------------------------------------------------------
const PAGE_MIN = 1;
const PAGE_SIZE_MIN = 0;
const RANK_BY_ENUMS = {
  TOTAL: 'total',
  TRENDY: 'trendy',
  PERSONALITY: 'personality',
  PRACTICALITY: 'practicallity',
  COST_EFFECTIVENESS: 'costEffectiveness',
};

// ----------------------------------------------------------
// UTILS
// ----------------------------------------------------------
// STRING 을 INTEGER 로 변환(FLOAT 방지)
const stringToInteger = (value) => {
  const integer = Number(value);
  if (!Number.isInteger(integer)) {
    throw new Error(`${value} is not an integer`);
  }
  return integer;
};

// ----------------------------------------------------------
// COERCE 자료형
// ----------------------------------------------------------
const Integer = coerce(number(), string(), stringToInteger);

// ----------------------------------------------------------
// 파라미터 정의
// ----------------------------------------------------------
const page = min(Integer, PAGE_MIN);
const pageSize = min(Integer, PAGE_SIZE_MIN);
const rankBy = enums(Object.values(RANK_BY_ENUMS));

// ----------------------------------------------------------
// 스키마 객체 정의
// ----------------------------------------------------------
// GET:RANKING
export const getRankingListSchema = {
  body: object({}),
  query: object({
    page: optional(page),
    pageSize: optional(pageSize),
    rankBy: optional(rankBy),
  }),
  params: object({}),
};

// ----------------------------------------------------------
// 검증 미들웨어
// ----------------------------------------------------------
// CURRYING | MIDDLEWARE FACTORY 패턴
export const validateRequest = (schema = {}) => {
  return async (req = {}, _res = {}, next) => {
    try {
      req.validated = {
        body: schema.body ? create(req.body ?? {}, schema.body) : undefined,
        query: schema.query ? create(req.query ?? {}, schema.query) : undefined,
        params: schema.params ? create(req.params ?? {}, schema.params) : undefined,
      };

      // NEXT TO CONTROLLER
      next();
    } catch (error) {
      if (error instanceof StructError) {
        error.statusCode = 400;
        error.message = undefined;
      }
      next(error);
    }
  };
};

// 필요 시 객체로도 가져가서 사용할 수 있습니다.
export default {
  validateRequest,
  getRankingListSchema,
};
