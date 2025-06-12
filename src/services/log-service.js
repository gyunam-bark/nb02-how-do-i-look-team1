import db from '../config/db.js';

// 내부 상수
const PRISMA_ORDER_BY = { ASCEND: 'asc', DESCEND: 'desc' };
const PRISMA_WHERE_MODE = { INSENSITIVE: 'insensitive', SENSITIVE: undefined };
const SORT_BY = { LATEST: 'latest', OLDEST: 'oldest' };
const DETAIL_KEY_LIST = ['endpoint', 'method', 'params', 'statusCode', 'message'];

const getWhere = (searchBy, keyword) => {
  const where = {};

  // KEYWORD 가 중요합니다.
  // SEARCH_BY 가 있어도 KEYWORD 가 없으면 의미가 없습니다.
  if (keyword) {
    // KEYWORD 에 띄어쓰기가 되어 있을지도 모르기 때문에 TRIM 처리합니다.
    keyword = keyword.trim();

    if (searchBy) {
      if (searchBy === 'ip') {
        // IP
        where.ip = {
          contains: keyword,
          mode: PRISMA_WHERE_MODE.SENSITIVE,
        };
      } else {
        // DETAIL 은 JSON 으로 저장됨
        where.detail = {
          path: [searchBy],
          string_contains: keyword,
        };
      }
    } else {
      // SEARCH_BY 가 없으면 전체에서 검색
      where.OR = [
        {
          ip: {
            contains: keyword,
            mode: PRISMA_WHERE_MODE.SENSITIVE,
          },
        },
        ...DETAIL_KEY_LIST.map((key) => ({
          detail: {
            path: [key],
            string_contains: keyword,
          },
        })),
      ];
    }
  }

  return where;
};

export default class LogService {
  static getLogList = async ({ page = 1, pageSize = 10, sortBy = '', searchBy, keyword }) => {
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const orderBy =
      sortBy === SORT_BY.OLDEST
        ? {
            createdAt: PRISMA_ORDER_BY.ASCEND,
          }
        : {
            createdAt: PRISMA_ORDER_BY.DESCEND,
          };

    const where = getWhere(searchBy, keyword);

    const [totalItemCount, logList] = await Promise.all([
      db.log.count({ where: where }),
      db.log.findMany({
        skip: skip,
        take: take,
        orderBy: orderBy,
        where: where,
      }),
    ]);

    return {
      totalItemCount: totalItemCount,
      data: logList,
    };
  };
}
