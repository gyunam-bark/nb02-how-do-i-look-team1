import db from '../config/db.js';

class RankService {
  async getRankingList({ page, pageSize, rankBy }) {
    const offset = (page - 1) * pageSize;

    // 전체 스타일 불러오기
    const allStyles = await db.style.findMany({
      include: {
        styleImages: {
          take: 1,
          include: { image: true },
        },
        styleTags: {
          include: { tag: true },
        },
        categories: true,
        curations: true,
      },
    });

    // 평균 점수 계산
    const stylesWithRating = allStyles.map((style) => {
      let rating = 0;

      if (style.curations.length === 0) {
        return { ...style, rating: null };
      }

      if (rankBy === 'personality') {
        const sum = style.curations.reduce((acc, cur) => acc + cur.personality, 0);
        rating = sum / style.curations.length;
      } else if (rankBy === 'practicality') {
        const sum = style.curations.reduce((acc, cur) => acc + cur.practicality, 0);
        rating = sum / style.curations.length;
      } else if (rankBy === 'costEffectiveness') {
        const sum = style.curations.reduce((acc, cur) => acc + cur.costEffectiveness, 0);
        rating = sum / style.curations.length;
      } else {
        // total (기본)
        const sum = style.curations.reduce(
          (acc, cur) => acc + cur.trendy + cur.personality + cur.practicality + cur.costEffectiveness,
          0
        );
        rating = sum / (style.curations.length * 4);
      }

      return { ...style, rating: Number(rating.toFixed(1)) };
    });

    // 점수 내림차순 정렬
    const sortedStyles = stylesWithRating.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // 페이지에 해당하는 항목만 잘라내기
    const paginated = sortedStyles.slice(offset, offset + pageSize);

    // 최종 응답 데이터 구성
    const data = paginated.map((style, index) => {
      const topCategory = style.categories.find((cat) => cat.type === 'TOP');

      return {
        id: style.styleId,
        thumbnail: style.styleImages[0]?.image.imageUrl || null,
        nickname: style.nickname,
        title: style.title,
        tags: style.styleTags.map((tag) => tag.tag.name),
        categories: topCategory
          ? {
              top: {
                name: topCategory.name,
                brand: topCategory.brand,
                price: Number(topCategory.price),
              },
            }
          : {},
        viewCount: style.viewCount,
        curationCount: style.curationCount,
        createdAt: style.createdAt,
        ranking: offset + index + 1,
        rating: style.rating,
      };
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(allStyles.length / pageSize),
      totalItemCount: allStyles.length,
      data,
    };
  }
}

export default RankService;
