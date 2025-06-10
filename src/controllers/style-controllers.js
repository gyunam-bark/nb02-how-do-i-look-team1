import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 태그 name 배열을 받아 findOrCreate 후 [{tagId}] 배열 반환
async function getOrCreateTagIds(tagNames = []) {
  const tagObjs = [];
  for (let name of tagNames) {
    const cleanName = name.trim();
    let tag = await prisma.tag.findUnique({ where: { name: cleanName } });
    if (!tag) {
      tag = await prisma.tag.create({ data: { name: cleanName } });
    }
    tagObjs.push({ tagId: tag.tagId });
  }
  return tagObjs;
}

export class StyleController {
  // 스타일 등록
  static async createStyle(req, res, next) {
    try {
      const { nickname, title, content, password, categories, tags = [], images } = req.body;

      // tags: name 배열 → tagId 배열 변환
      const tagObjs = await getOrCreateTagIds(tags);

      const newStyle = await prisma.style.create({
        data: {
          nickname,
          title,
          content,
          password,
          categories: { create: categories || [] },
          styleTags: { create: tagObjs }, // [{tagId}, ...]
          images: { create: images?.map(({ url }) => ({ imageUrl: url })) || [] },
        },
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          images: true,
        },
      });

      res.status(201).json(newStyle);
    } catch (err) {
      next(err);
    }
  }

  // 스타일 목록 조회
  static async getStyles(req, res, next) {
    try {
      const {
        page = 1,
        pageSize = 10,
        sort = 'latest', // latest, views, curation
        search,
      } = req.query;

      const where = search
        ? {
            OR: [
              { nickname: { contains: search } },
              { title: { contains: search } },
              { content: { contains: search } },
            ],
          }
        : {};

      let orderBy;
      if (sort === 'views') orderBy = { viewCount: 'desc' };
      else if (sort === 'curation') orderBy = { curationCount: 'desc' };
      else orderBy = { createdAt: 'desc' };

      const [total, styles] = await Promise.all([
        prisma.style.count({ where }),
        prisma.style.findMany({
          where,
          skip: (page - 1) * pageSize,
          take: +pageSize,
          orderBy,
          include: {
            categories: true,
            styleTags: { include: { tag: true } },
            images: true,
            _count: { select: { curations: true } },
          },
        }),
      ]);

      res.json({ total, styles });
    } catch (err) {
      next(err);
    }
  }

  // 스타일 상세 조회 (+조회수 증가)
  static async getStyleDetail(req, res, next) {
    try {
      const { styleId } = req.params;

      // 조회수 증가
      await prisma.style.update({
        where: { styleId: +styleId },
        data: { viewCount: { increment: 1 } },
      });

      const style = await prisma.style.findUnique({
        where: { styleId: +styleId },
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          images: true,
          curations: true,
          comments: true,
        },
      });

      if (!style) return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      res.json(style);
    } catch (err) {
      next(err);
    }
  }

  // 스타일 수정
  static async updateStyle(req, res, next) {
    try {
      const { styleId } = req.params;
      const { password, title, content, categories, tags = [], images } = req.body;

      const style = await prisma.style.findUnique({ where: { styleId: +styleId } });
      if (!style) return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      if (style.password !== password) return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });

      // tags: name 배열 → tagId 배열 변환
      const tagObjs = await getOrCreateTagIds(tags);

      // 기존 연결 데이터 삭제 후 재생성 방식
      const updatedStyle = await prisma.style.update({
        where: { styleId: +styleId },
        data: {
          title,
          content,
          categories: { deleteMany: {}, create: categories || [] },
          styleTags: { deleteMany: {}, create: tagObjs },
          images: { deleteMany: {}, create: images?.map(({ url }) => ({ imageUrl: url })) || [] },
          updatedAt: new Date(),
        },
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          images: true,
        },
      });

      res.json(updatedStyle);
    } catch (err) {
      next(err);
    }
  }

  // 스타일 삭제
  static async deleteStyle(req, res, next) {
    try {
      const { styleId } = req.params;
      const { password } = req.body;
      const style = await prisma.style.findUnique({ where: { styleId: +styleId } });
      if (!style) return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      if (style.password !== password) return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });

      await prisma.style.delete({ where: { styleId: +styleId } });
      res.json({ message: '스타일이 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
}
