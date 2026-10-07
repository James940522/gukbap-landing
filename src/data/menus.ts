export type Menu = {
  id: string;
  name: string;
  image: string;
};

export type MenuGroup = {
  id: string;
  name: string;
  english: string;
  items: Menu[];
};

export type MenuCategory = MenuGroup & {
  groups?: MenuGroup[];
};

type MenuFolder = {
  id: string;
  name: string;
  english: string;
  folder: string;
  names: string[];
};

function fromFolder({ id, name, english, folder, names }: MenuFolder): MenuGroup {
  // Preserve the decomposed Korean filenames copied from the iCloud folder.
  // Encode each segment so the same asset URLs also work on Linux deployments.
  const assetFolder = folder
    .split("/")
    .map((segment) => encodeURIComponent(segment.normalize("NFD")))
    .join("/");

  return {
    id,
    name,
    english,
    items: names.map((menuName, index) => ({
      id: `${id}-${index + 1}`,
      name: menuName,
      image: `/asset/menu/${assetFolder}/${encodeURIComponent(`${menuName}.jpg`.normalize("NFD"))}`,
    })),
  };
}

const sideGroups: MenuGroup[] = [
  fromFolder({
    id: "side-dishes",
    name: "사이드",
    english: "SIDE DISHES",
    folder: "사이드/사이드",
    names: ["수육", "순대", "돼지내장볶음"],
  }),
  fromFolder({
    id: "mandu",
    name: "만두",
    english: "MANDU",
    folder: "사이드/만두",
    names: ["고기왕만두", "김치왕만두", "반반왕만두", "갈비만두"],
  }),
  fromFolder({
    id: "jeon",
    name: "전",
    english: "JEON",
    folder: "사이드/전",
    names: ["김치전", "부추전", "동그랑땡", "동태전", "육전", "옥수수전", "떡갈비"],
  }),
];

// Categories follow the supplied folders; menu names are the exact file stems.
// Prices and descriptions can be added when the brand provides them.
export const menuCategories: MenuCategory[] = [
  fromFolder({
    id: "gukbap",
    name: "뚝손국밥",
    english: "DDUKSON GUKBAP",
    folder: "뚝손국밥",
    names: ["돼지국밥", "누룽지돼지국밥", "내장국밥", "순대국밥", "누룽지순대국밥", "황태해장국"],
  }),
  fromFolder({
    id: "clear",
    name: "맑은국밥",
    english: "CLEAR BROTH",
    folder: "맑은국밥",
    names: ["맑은돼지국밥"],
  }),
  fromFolder({
    id: "spicy",
    name: "얼큰국밥",
    english: "SPICY BROTH",
    folder: "얼큰국밥",
    names: ["얼큰돼지국밥", "얼큰누룽지돼지국밥", "얼큰내장국밥", "얼큰순대국밥", "얼큰누룽지순대국밥", "얼큰황태국밥"],
  }),
  fromFolder({
    id: "yukgaejang",
    name: "육개장",
    english: "YUKGAEJANG",
    folder: "육개장",
    names: ["돈개장", "황태육개장"],
  }),
  {
    id: "side",
    name: "사이드",
    english: "SIDE DISHES",
    groups: sideGroups,
    items: sideGroups.flatMap((group) => group.items),
  },
];
