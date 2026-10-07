import { menuCategories } from "./menus";

export { menuCategories } from "./menus";
export type { Menu, MenuCategory } from "./menus";

// Brand copy is a draft. Menu names were supplied by the brand owner.
export const brand = {
  name: '뚝손국밥',
  company: '주식회사 산본에프앤비',
  representatives: '이호남',
  businessNumber: '589-86-02728',
  phone: '010-6739-9203',
  phoneHref: 'tel:01067399203',
  address: '경기도 하남시 풍산동 492 미사하우스디엘타워 6층 621-2호',
  email: 'wochl123@naver.com',
  hero: {
    eyebrow: '한 그릇을 대하는 진심',
    title: ['뜨끈하게,', '제대로.'],
    description: '한 숟갈의 온기, 오래 남는 든든함.',
    detail: '매일 생각나는 국밥을 만듭니다.',
  },
};

export const navigation = [
  { label: '브랜드', href: '#brand' },
  { label: '메뉴', href: '#menu' },
  { label: '뚝손의 기준', href: '#standard' },
  { label: '창업 안내', href: '#franchise' },
];

// Brand-supplied sample photography. Originals are kept in assets/food/originals.
export const foodImages = {
  spoon: '/images/food/gukbap-spoon.webp',
  sundae: '/images/food/sundae-closeup.webp',
  cooking: '/images/food/pot-cooking.webp',
};

export const brandValues = [
  {
    keyword: '정성',
    title: '한 그릇의 정성',
    description: '익숙한 음식일수록, 더 마음을 씁니다.',
  },
  {
    keyword: '깊은 맛',
    title: '오래 남는 깊은 맛',
    description: '첫 숟갈의 온기가 좋은 기억으로 남도록.',
  },
  {
    keyword: '든든함',
    title: '속까지 든든하게',
    description: '잘 먹었다는 한마디를 생각합니다.',
  },
];

// TODO: Add confirmed nurungji and table-setting photographs.
export const nurungjiFeature = {
  image: null as string | null,
  menus: menuCategories
    .flatMap(category => category.items)
    .filter(menu => menu.name.includes('누룽지')),
};

export const pairingFeature = {
  image: null as string | null,
  // Editorial suggestions using existing dishes, not fixed sets or promotions.
  suggestions: [
    {
      title: '든든하게 채우고 싶은 날',
      dishes: ['돼지국밥', '수육'],
      description: '뜨끈한 한 그릇에, 고기 한 점을 더해.',
    },
    {
      title: '얼큰하게 즐기고 싶은 날',
      dishes: ['얼큰순대국밥', '부추전'],
      description: '얼큰한 국밥 한 숟갈, 전 한 점의 즐거움.',
    },
    {
      title: '따뜻하게 나누고 싶은 날',
      dishes: ['맑은돼지국밥', '고기왕만두'],
      description: '맑은 국밥 곁에, 함께 나누는 만두 한 접시.',
    },
  ],
};

// User-supplied copy with AI concept imagery. Prompts: assets/food/generated/manifest.json.
// Replace with actual brand photography when available.
export const brothFeature = {
  description: ['뚝손국밥만의 특별한 전용육수와', '엄선된 재료로'],
  title: ['원팩만큼 쉽지만,', '제대로 끓여낸', '한 그릇의 힘.'],
  elements: [
    {
      id: 'broth',
      label: '뚝손국밥 전용육수',
      caption: '전용육수',
      placeholder: '전용육수 이미지',
      image: '/images/food/signature-broth-ai.webp' as string | null,
      alt: '김이 오르는 뚝배기에 담긴 진한 육수 — 인공지능 연출 이미지',
    },
    {
      id: 'ingredients',
      label: '엄선된 재료',
      caption: '엄선한 재료',
      placeholder: '엄선된 재료 이미지',
      image: '/images/food/selected-ingredients-ai.webp' as string | null,
      alt: '어두운 도자기 접시 위의 돼지고기와 대파, 마늘 — 인공지능 연출 이미지',
    },
  ],
};

export const standards = [
  {
    number: '01',
    title: '육수',
    keyword: '육수',
    subtitle: '깊은 맛의 시작.',
    description:
      '한 숟갈에 전해지는 깊이. 뚝손이 한 그릇을 생각하는 첫 번째 기준입니다.',
  },
  {
    number: '02',
    title: '재료',
    keyword: '재료',
    subtitle: '기본을 소중하게.',
    description:
      '좋은 한 끼의 시작은 재료에 있다고 믿습니다. 익숙한 맛의 기본을 생각합니다.',
  },
  {
    number: '03',
    title: '조리',
    keyword: '조리',
    subtitle: '온기까지 담아서.',
    description:
      '첫 숟갈부터 마지막 숟갈까지. 따뜻하게 기억되는 한 그릇을 지향합니다.',
  },
  {
    number: '04',
    title: '운영',
    keyword: '한결같음',
    subtitle: '한결같은 마음으로.',
    description:
      '다시 찾고 싶은 편안함. 한 그릇을 내놓는 마음이 브랜드의 기준이 됩니다.',
  },
];

// TODO: Replace these preview topics with confirmed franchise policies.
export const franchiseTopics = [
  {
    number: '01',
    title: '운영 시스템',
    description: '한 그릇의 기준이 매장의 일상으로 이어지도록.',
    detail: '운영 방식과 매장 구성에 관한 세부 안내를 준비하고 있습니다.',
  },
  {
    number: '02',
    title: '창업 절차',
    description: '새로운 시작에 필요한 과정을 하나씩.',
    detail: '창업 상담부터 오픈까지의 절차는 확정 후 안내할 예정입니다.',
  },
  {
    number: '03',
    title: '본사 지원',
    description: '함께 오래갈 수 있는 방향을 생각합니다.',
    detail: '교육과 운영 지원의 구체적인 범위는 추후 공개할 예정입니다.',
  },
];
