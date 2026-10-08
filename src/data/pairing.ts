import { menuCategories } from "./menus";

const menus = menuCategories.flatMap((category) => category.items);

function menuByName(name: string) {
  const menu = menus.find((item) => item.name === name);
  if (!menu) throw new Error(`Pairing menu not found: ${name}`);
  return menu;
}

export const pairingFeature = {
  // Brand-supplied menu assortment. Keep the original composition and dishes.
  image: "/images/strategy/menu-assortment-hq.webp",
  imageAlt: "진한 국밥과 얼큰한 국밥, 수육과 순대를 함께 차린 뚝손국밥 메뉴 모음",
  description: [
    "뜨끈한 국밥에 수육, 전, 만두까지.",
    "혼자 든든하게, 여럿이 넉넉하게.",
    "뚝손의 맛을 한 상에 펼쳐보세요.",
  ],
  categories: [
    { name: "국밥", detail: "진하게 · 맑게 · 얼큰하게", icon: "bowl" },
    { name: "수육 · 순대", detail: "국밥 곁에 더하는 한 접시", icon: "plate" },
    { name: "전", detail: "부추전부터 육전까지", icon: "plate" },
    { name: "만두", detail: "고기 · 김치 · 반반", icon: "mandu" },
  ],
  // Editorial combinations of supplied menus; no set-menu or price claims.
  suggestions: [
    {
      id: "hearty",
      label: "든든하게",
      occasion: "한 끼를 든든하게 채우고 싶은 날",
      title: "국밥 한 숟갈, 수육 한 점.",
      dishes: [menuByName("돼지국밥"), menuByName("수육")],
      description: "뜨끈한 돼지국밥에 수육 한 접시를 더해보세요. 한 그릇의 든든함이 한 상의 즐거움으로 이어집니다.",
      note: "국밥과 고기를 함께 즐기는 조합",
    },
    {
      id: "spicy",
      label: "얼큰하게",
      occasion: "얼큰한 맛이 생각나는 날",
      title: "얼큰한 국밥 곁에, 전 한 점.",
      dishes: [menuByName("얼큰순대국밥"), menuByName("부추전")],
      description: "얼큰순대국밥 한 숟갈에 부추전 한 점. 국물과 곁들임을 번갈아 즐기며 오늘의 한 상을 채워보세요.",
      note: "얼큰한 국물에 전을 곁들이는 조합",
    },
    {
      id: "together",
      label: "함께",
      occasion: "따뜻한 한 상을 나누고 싶은 날",
      title: "따로 한 그릇, 같이 한 접시.",
      dishes: [menuByName("맑은돼지국밥"), menuByName("고기왕만두")],
      description: "각자의 국밥에 함께 나눌 만두 한 접시. 맑은돼지국밥과 고기왕만두로 식탁 위의 즐거움을 더해보세요.",
      note: "함께 먹는 자리에도 어울리는 조합",
    },
  ],
};
