import { menuCategories } from "@/data/menus";

export type NurungjiMenu = {
  id: string;
  name: string;
  image: string;
  shortName: string;
  styleLabel: string;
  description: string;
};

const menuDetails: Omit<NurungjiMenu, "id" | "image">[] = [
  {
    name: "누룽지돼지국밥",
    shortName: "돼지국밥",
    styleLabel: "기본",
    description: "뜨끈한 돼지국밥에 누룽지의 고소함을 더했습니다.",
  },
  {
    name: "누룽지순대국밥",
    shortName: "순대국밥",
    styleLabel: "기본",
    description: "뜨끈한 순대국밥에 누룽지의 고소함을 더했습니다.",
  },
  {
    name: "얼큰누룽지돼지국밥",
    shortName: "돼지국밥",
    styleLabel: "얼큰",
    description: "얼큰한 돼지국밥에 누룽지의 고소함을 더했습니다.",
  },
  {
    name: "얼큰누룽지순대국밥",
    shortName: "순대국밥",
    styleLabel: "얼큰",
    description: "얼큰한 순대국밥에 누룽지의 고소함을 더했습니다.",
  },
];

const existingMenus = menuCategories.flatMap((category) => category.items);

export const nurungjiMenus: NurungjiMenu[] = menuDetails.map((details) => {
  const menu = existingMenus.find((item) => item.name === details.name);

  if (!menu) {
    throw new Error(`누룽지 섹션에 필요한 메뉴가 없습니다: ${details.name}`);
  }

  return { ...details, ...menu };
});

export const nurungjiStory = {
  eyebrow: "NURUNGJI GUKBAP",
  lead: "국밥의 뜨끈함에,\n누룽지의 고소함을.",
  description: [
    "뜨끈한 국밥 한 그릇에 누룽지를 더했습니다.",
    "국밥의 뜨끈함과 누룽지의 고소함을 한 숟갈에 만나보세요.",
  ],
  detailTitle: "국밥 사이사이, 누룽지.",
  detailDescription: "국밥 속 누룽지까지, 한 숟갈에 함께.",
  selectionTitle: "누룽지로 만나는 네 가지 국밥.",
  selectionDescription: "돼지와 순대, 기본과 얼큰.",
};
