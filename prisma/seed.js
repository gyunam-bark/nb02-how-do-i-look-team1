import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {

  await prisma.comment.deleteMany({});
  await prisma.curation.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.styleTag.deleteMany({});
  await prisma.styleImage.deleteMany({});
  await prisma.style.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.image.deleteMany({});

  // 1. Seed 태그 (중복 방지)
  const tagNames = [
    '캐주얼', '스트릿', '미니멀', '포멀', '빈티지',
    '스포티', '러블리', '여름', '겨울', '컬러풀'
  ];
  await Promise.all(tagNames.map(name => prisma.tag.upsert({
    where: { name },
    update: {},
    create: { name }
  })));

  // 2. Seed 이미지
  const imageUrls = [
    'https://img.example.com/style1.jpg',
    'https://img.example.com/style2.jpg',
    'https://img.example.com/style3.jpg',
    'https://img.example.com/style4.jpg',
    'https://img.example.com/style5.jpg',
    'https://img.example.com/style6.jpg',
    'https://img.example.com/style7.jpg',
    'https://img.example.com/style8.jpg',
    'https://img.example.com/style9.jpg',
    'https://img.example.com/style10.jpg',
    'https://img.example.com/style11.jpg',
    'https://img.example.com/style12.jpg',
  ];
  const images = await Promise.all(imageUrls.map(url => prisma.image.create({ data: { imageUrl: url } })));

  // 3. Seed 스타일 10개
  
  const styleDatas = [
    {
      nickname: '혜원',
      title: '여름 미니멀룩',
      content: '린넨 셔츠와 와이드 슬랙스로 미니멀하게!',
      password: 'pw1',
      categories: [
        { type: 'TOP', name: '린넨 셔츠', brand: '무신사', price: 39000n },
        { type: 'BOTTOM', name: '와이드 슬랙스', brand: '코스', price: 79000n },
        { type: 'SHOES', name: '샌들', brand: '버켄스탁', price: 129000n }
      ],
      tagNames: ['미니멀', '여름'],
      imageIdx: [0, 1]
    },
    {
      nickname: '승관',
      title: '빈티지 데님 스타일',
      content: '오버사이즈 청자켓과 찢어진 데님팬츠로 빈티지 무드',
      password: 'pw2',
      categories: [
        { type: 'OUTER', name: '청자켓', brand: '리바이스', price: 99000n },
        { type: 'BOTTOM', name: '데님팬츠', brand: '지오다노', price: 59000n }
      ],
      tagNames: ['빈티지', '캐주얼'],
      imageIdx: [2]
    },
    {
      nickname: '우재',
      title: '포멀 오피스룩',
      content: '블레이저와 슬랙스로 깔끔한 오피스룩',
      password: 'pw3',
      categories: [
        { type: 'TOP', name: '블레이저', brand: '자라', price: 99000n },
        { type: 'BOTTOM', name: '슬랙스', brand: '유니클로', price: 59000n },
        { type: 'SHOES', name: '로퍼', brand: '닥터마틴', price: 139000n }
      ],
      tagNames: ['포멀'],
      imageIdx: [3]
    },
    {
      nickname: '미주',
      title: '컬러풀 썸머룩',
      content: '형광 핑크탑과 옐로우 스커트로 톡톡 튀게!',
      password: 'pw4',
      categories: [
        { type: 'TOP', name: '네온 핑크탑', brand: 'H&M', price: 19000n },
        { type: 'BOTTOM', name: '옐로우 스커트', brand: '자라', price: 39000n }
      ],
      tagNames: ['컬러풀', '여름', '러블리'],
      imageIdx: [4, 5]
    },
    {
      nickname: '보검',
      title: '스트릿 무드',
      content: '후드집업과 카고팬츠, 볼캡으로 완성!',
      password: 'pw5',
      categories: [
        { type: 'TOP', name: '후드집업', brand: '스투시', price: 129000n },
        { type: 'BOTTOM', name: '카고팬츠', brand: '칼하트', price: 99000n },
        { type: 'ACCESSORY', name: '볼캡', brand: '뉴에라', price: 35000n }
      ],
      tagNames: ['스트릿', '캐주얼'],
      imageIdx: [6]
    },
    {
      nickname: '미현',
      title: '러블리 원피스룩',
      content: '플라워 패턴 원피스로 러블리하게',
      password: 'pw6',
      categories: [
        { type: 'DRESS', name: '플라워 원피스', brand: '로엠', price: 49000n },
        { type: 'SHOES', name: '메리제인 슈즈', brand: '바바라', price: 59000n }
      ],
      tagNames: ['러블리', '여름'],
      imageIdx: [7]
    },
    {
      nickname: '영지',
      title: '겨울 코트 스타일',
      content: '로브코트와 니트, 부츠로 따뜻하게!',
      password: 'pw7',
      categories: [
        { type: 'OUTER', name: '로브코트', brand: '코스', price: 159000n },
        { type: 'TOP', name: '울 니트', brand: '탑텐', price: 59000n },
        { type: 'SHOES', name: '롱부츠', brand: '닥터마틴', price: 179000n }
      ],
      tagNames: ['겨울', '포멀'],
      imageIdx: [8, 9]
    },
    {
      nickname: '민규',
      title: '스포티 트레이닝룩',
      content: '트랙탑, 트레이닝팬츠, 스니커즈!',
      password: 'pw8',
      categories: [
        { type: 'TOP', name: '트랙탑', brand: '나이키', price: 89000n },
        { type: 'BOTTOM', name: '트레이닝팬츠', brand: '아디다스', price: 69000n },
        { type: 'SHOES', name: '스니커즈', brand: '뉴발란스', price: 99000n }
      ],
      tagNames: ['스포티', '캐주얼'],
      imageIdx: [10]
    },
    {
      nickname: '혜윤',
      title: '모던 가방 포인트룩',
      content: '심플한 블라우스와 컬러백으로 포인트',
      password: 'pw9',
      categories: [
        { type: 'TOP', name: '블라우스', brand: '자라', price: 49000n },
        { type: 'BAG', name: '컬러백', brand: '코치', price: 159000n }
      ],
      tagNames: ['미니멀', '컬러풀'],
      imageIdx: [11]
    },
    {
      nickname: '재욱',
      title: '남친룩의 정석',
      content: '셔츠와 슬랙스, 더비슈즈 깔끔하게!',
      password: 'pw10',
      categories: [
        { type: 'TOP', name: '셔츠', brand: '무신사', price: 39000n },
        { type: 'BOTTOM', name: '슬랙스', brand: '유니클로', price: 59000n },
        { type: 'SHOES', name: '더비슈즈', brand: '닥터마틴', price: 139000n }
      ],
      tagNames: ['포멀', '캐주얼'],
      imageIdx: [0, 4]
    }
  ];

  for (const [i, styleData] of styleDatas.entries()) {
    try {
    const createdStyle = await prisma.style.create({
      data: {
        nickname: styleData.nickname,
        title: styleData.title,
        content: styleData.content,
        password: styleData.password,
        categories: {
          create: styleData.categories,
        },
        styleTags: {
          create: await Promise.all(
            styleData.tagNames.map(async (name) => {
              const tag = await prisma.tag.findUnique({ where: { name } });
              return { tagId: tag.tagId };
            })
          ),
        },
        styleImages: {
          create: styleData.imageIdx.map(idx => ({
            imageId: images[idx].imageId,
          }))
        }
      }
    });
    console.log(`[${i + 1}/10] 스타일 생성 성공:`, createdStyle.title);
  } catch (e) {
    console.error(`[${i + 1}/10] 스타일 생성 실패`, e);
  }
}



const styleList = await prisma.style.findMany({ orderBy: { styleId: 'asc' } });

const curationSeeds = [
  {
    styleIdx: 0, // 혜원, 여름 미니멀룩
    nickname: '리뷰어A',
    content: '여름에 정말 잘 어울리는 룩이네요!',
    password: 'cur1',
    trendy: 5,
    personality: 4,
    practicality: 5,
    costEffectiveness: 4,
  },
  {
    styleIdx: 0,
    nickname: '리뷰어B',
    content: '미니멀하지만 포인트가 살아있어요',
    password: 'cur2',
    trendy: 4,
    personality: 5,
    practicality: 4,
    costEffectiveness: 5,
  },
  {
    styleIdx: 1, // 승관, 빈티지 데님
    nickname: '리뷰어C',
    content: '청자켓 찢어진 데님 조합 최고!',
    password: 'cur3',
    trendy: 3,
    personality: 5,
    practicality: 4,
    costEffectiveness: 3,
  },
  {
    styleIdx: 2, // 우재, 포멀 오피스룩
    nickname: '리뷰어D',
    content: '출근룩 고민 끝났어요!',
    password: 'cur4',
    trendy: 4,
    personality: 3,
    practicality: 5,
    costEffectiveness: 4,
  },
  {
    styleIdx: 3, // 미주, 컬러풀 썸머룩
    nickname: '리뷰어E',
    content: '컬러 매치 센스가 대박~',
    password: 'cur5',
    trendy: 5,
    personality: 5,
    practicality: 3,
    costEffectiveness: 4,
  },
  {
    styleIdx: 4, // 보검, 스트릿
    nickname: '리뷰어F',
    content: '볼캡+카고 조합 킹왕짱!',
    password: 'cur6',
    trendy: 5,
    personality: 4,
    practicality: 4,
    costEffectiveness: 5,
  },
  {
    styleIdx: 5, // 미현, 원피스
    nickname: '리뷰어G',
    content: '꽃무늬 원피스 진짜 예뻐요',
    password: 'cur7',
    trendy: 4,
    personality: 4,
    practicality: 3,
    costEffectiveness: 4,
  },
  {
    styleIdx: 6, // 영지, 겨울코트
    nickname: '리뷰어H',
    content: '따뜻+스타일 다 잡았네',
    password: 'cur8',
    trendy: 3,
    personality: 3,
    practicality: 5,
    costEffectiveness: 5,
  },
  {
    styleIdx: 7, // 민규, 스포티
    nickname: '리뷰어I',
    content: '운동할 때도 패션을 챙기다니!',
    password: 'cur9',
    trendy: 4,
    personality: 4,
    practicality: 5,
    costEffectiveness: 4,
  },
  {
    styleIdx: 8, // 혜윤, 모던 가방
    nickname: '리뷰어J',
    content: '컬러백이 포인트!',
    password: 'cur10',
    trendy: 3,
    personality: 5,
    practicality: 4,
    costEffectiveness: 3,
  },
  {
    styleIdx: 9, // 재욱, 남친룩
    nickname: '리뷰어K',
    content: '깔끔한 남친룩의 정석',
    password: 'cur11',
    trendy: 5,
    personality: 4,
    practicality: 5,
    costEffectiveness: 4,
  },
];

for (const curation of curationSeeds) {
  await prisma.curation.create({
    data: {
      styleId: styleList[curation.styleIdx].styleId,
      nickname: curation.nickname,
      content: curation.content,
      password: curation.password,
      trendy: curation.trendy,
      personality: curation.personality,
      practicality: curation.practicality,
      costEffectiveness: curation.costEffectiveness,
    },
  });
}
console.log('큐레이션 시딩 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });