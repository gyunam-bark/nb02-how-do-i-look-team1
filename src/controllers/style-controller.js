import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 태그 name 배열을 받아 findOrCreate 후 [{ tagId }] 배열 반환
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

// 이미지 url 배열을 받아 Image 테이블에 저장 후 [{ imageId }] 배열 반환
async function createImagesAndReturnIds(images = []) {
  const imageObjs = [];
  for (let img of images || []) {
    const newImage = await prisma.image.create({
      data: { imageUrl: url },
    });
    imageObjs.push({ imageId: newImage.imageId });
  }
  return imageObjs;
}

// BigInt JSON 직렬화 변환
function jsonBigIntReplacer(key, value) {
  return typeof value === 'bigint' ? value.toString() : value;
}

// categories 배열 → 객체 변환 (응답용)
function categoriesArrayToObject(categoriesArr) {
  const obj = {};
  for (const cat of categoriesArr) {
    obj[cat.type.toLowerCase()] = {
      name: cat.name,
      brand: cat.brand,
      price: cat.price.toString(),
    };
  }
  return obj;
}

export class StyleController {
  // 스타일 등록
  static async createStyle(req, res, next) {
    try {
      const { nickname, title, content, password, categories, tags = [], images = [] } = req.body;

      // categories: 객체 또는 배열 → 배열로 변환 (Prisma 저장용)
      let categoriesArr = [];
      if (categories && Array.isArray(categories)) {
        categoriesArr = categories.map((cat) => ({
          ...cat,
          price: BigInt(cat.price),
        }));
      } else if (categories && typeof categories === 'object' && !Array.isArray(categories)) {
        categoriesArr = Object.entries(categories).map(([key, value]) => ({
          type: key.toUpperCase(),
          ...value,
          price: BigInt(value.price),
        }));
      }

      // 태그 findOrCreate → [{ tagId }]
      const tagObjs = await getOrCreateTagIds(tags);
      // 이미지 등록 → [{ imageId }]
      const imageObjs = await createImagesAndReturnIds(images);

      const newStyle = await prisma.style.create({
        data: {
          nickname,
          title,
          content,
          password,
          categories: {
            create: categoriesArr,
          },
          styleTags: {
            create: tagObjs.map((obj) => ({
              tag: { connect: { tagId: obj.tagId } },
            })),
          },
          styleImages: {
            create: imageObjs.map((obj) => ({
              image: { connect: { imageId: obj.imageId } },
            })),
          },
        },
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          styleImages: { include: { image: true } },
        },
      });

      // 응답에서 categories를 객체로 변환
      const response = {
        ...newStyle,
        categories: categoriesArrayToObject(newStyle.categories),
        // tags 항상 배열로 반환
        tags: Array.isArray(newStyle.styleTags)
          ? newStyle.styleTags.map(st => st.tag?.name ?? '')
          : [],
        imageUrls: Array.isArray(newStyle.styleImages)
          ? newStyle.styleImages.map(si => si.image?.imageUrl ?? '')
          : [],
      };
      res.status(201).set('Content-Type', 'application/json').send(JSON.stringify(response, jsonBigIntReplacer));
    } catch (err) {
      next(err);
    }
  }

  // 스타일 목록 조회
  static async getStyleList(req, res, next) {
    try {
      const { page = 1, pageSize = 10, sort = 'latest', search } = req.query;

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
            styleImages: { include: { image: true } },
            _count: { select: { curations: true } },
          },
        }),
      ]);

      // // 각 style의 categories를 객체로 변환##########
      // const stylesObj = styles.map((style) => ({
      //   ...style,
      //   categories: categoriesArrayToObject(style.categories),
      // }));
      
      const stylesObj = styles.map((style) => ({
        id: style.styleId,
        nickname: style.nickname,
        title: style.title,
        content: style.content,
        viewCount: style.viewCount,
        curationCount: style.curationCount,
        createdAt: style.createdAt,
        // 각 style의 categories를 객체로 변환
        categories: categoriesArrayToObject(style.categories), 
        // tags 항상 배열로 반환
        tags: Array.isArray(style.styleTags)
          ? style.styleTags.map(st => st.tag?.name ?? '').filter(Boolean)
          : [],
        imageUrls: Array.isArray(style.styleImages)
          ? style.styleImages.map(si => si.image?.imageUrl ?? '').filter(Boolean)
          : [],
      }));
      
      res
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ total, styles: stylesObj }, jsonBigIntReplacer));
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
          styleImages: { include: { image: true } },
          curations: true,
        },
      });

      if (!style) return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      
      const response = {
        id: style.styleId,
        nickname: style.nickname,
        title: style.title,
        content: style.content,
        viewCount: style.viewCount,
        curationCount: style.curationCount,
        createdAt: style.createdAt,
        categories: categoriesArrayToObject(style.categories),
        // tags 항상 배열로 반환
        tags: Array.isArray(style.styleTags)
          ? style.styleTags.map(st => st.tag?.name ?? '').filter(Boolean)
          : [],
        imageUrls: Array.isArray(style.styleImages)
          ? style.styleImages.map(si => si.image?.imageUrl ?? '').filter(Boolean)
          : [],
      };
      res.set('Content-Type', 'application/json').send(JSON.stringify(response, jsonBigIntReplacer));
    } catch (err) {
      next(err);
    }
  }

  // 스타일 수정
  static async updateStyle(req, res, next) {
    try {
      const { styleId } = req.params;
      const { password, title, content, categories, tags = [], images = [] } = req.body;

      const style = await prisma.style.findUnique({ where: { styleId: +styleId } });
      if (!style) return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      if (style.password !== password) return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });

      // categories: 객체 또는 배열 → 배열로 변환 (Prisma 저장용)
      let categoriesArr = [];
      if (categories && Array.isArray(categories)) {
        categoriesArr = categories.map((cat) => ({
          ...cat,
          price: BigInt(cat.price),
        }));
      } else if (categories && typeof categories === 'object' && !Array.isArray(categories)) {
        categoriesArr = Object.entries(categories).map(([key, value]) => ({
          type: key.toUpperCase(),
          ...value,
          price: BigInt(value.price),
        }));
      }

      // 태그 findOrCreate
      const tagObjs = await getOrCreateTagIds(tags);
      // 이미지 등록
      const imageObjs = await createImagesAndReturnIds(images);

      // 기존 연결 데이터(카테고리, 태그, 이미지) 삭제 후 재생성 방식
      const updatedStyle = await prisma.style.update({
        where: { styleId: +styleId },
        data: {
          title,
          content,
          categories: { deleteMany: {}, create: categoriesArr },
          styleTags: { deleteMany: {}, create: tagObjs.map((obj) => ({ tag: { connect: { tagId: obj.tagId } } })) },
          styleImages: {
            deleteMany: {},
            create: imageObjs.map((obj) => ({
              image: {
                connect: { imageId: obj.imageId },
              },
            })),
          },
          updatedAt: new Date(),
        },
        include: {
          categories: true,
          styleTags: { include: { tag: true } },
          styleImages: { include: { image: true } },
        },
      });

      // 응답에서 categories를 객체로 변환
      const response = {
        id: updatedStyle.styleId,
        nickname: updatedStyle.nickname,
        title: updatedStyle.title,
        content: updatedStyle.content,
        viewCount: updatedStyle.viewCount,
        curationCount: updatedStyle.curationCount,
        createdAt: updatedStyle.createdAt,
        categories: categoriesArrayToObject(updatedStyle.categories),
        tags: Array.isArray(updatedStyle.styleTags)
          ? updatedStyle.styleTags.map(st => st.tag?.name ?? '').filter(Boolean)
          : [],
        imageUrls: Array.isArray(updatedStyle.styleImages)
          ? updatedStyle.styleImages.map(si => si.image?.imageUrl ?? '').filter(Boolean)
          : [],
      };
      res.set('Content-Type', 'application/json').send(JSON.stringify(response, jsonBigIntReplacer));
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
  
      if (!style) {
        return res.status(404).json({ message: '스타일을 찾을 수 없습니다.' });
      }
  
      if (style.password !== password) {
        return res.status(403).json({ message: '비밀번호가 일치하지 않습니다.' });
      }
  
      // 1. 연관 데이터 먼저 삭제 (외래키 제약 해소)
      await prisma.category.deleteMany({ where: { styleId: +styleId } });
      await prisma.styleTag.deleteMany({ where: { styleId: +styleId } });
      await prisma.styleImage.deleteMany({ where: { styleId: +styleId } });
  
      // 2. 스타일 삭제
      await prisma.style.delete({ where: { styleId: +styleId } });
  
      return res.status(200).json({ message: '스타일이 삭제되었습니다.' });
    } catch (err) {
      next(err); 
    }
  }
  static async createCuration(req, res, next) {
    // TODO: 구현
    res.status(501).json({ message: 'Not implemented' });
  }
  
  static async getCurationList(req, res, next) {
    // TODO: 구현
    res.status(501).json({ message: 'Not implemented' });
  }
}
