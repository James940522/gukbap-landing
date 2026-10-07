export type Menu = {
  id: string;
  name: string;
  image: string;
};

export type MenuGroup = {
  id: string;
  name: string;
  caption: string;
  items: Menu[];
};

export type MenuCategory = MenuGroup & {
  groups?: MenuGroup[];
};

type MenuFolder = {
  id: string;
  name: string;
  caption: string;
  folder: string;
  names: string[];
};

function fromFolder({ id, name, caption, folder, names }: MenuFolder): MenuGroup {
  // Git stores these filenames in NFC. macOS also resolves NFD paths, but
  // Linux deployments require the URL to match the committed filename exactly.
  const assetFolder = folder
    .split("/")
    .map((segment) => encodeURIComponent(segment.normalize("NFC")))
    .join("/");

  return {
    id,
    name,
    caption,
    items: names.map((menuName, index) => ({
      id: `${id}-${index + 1}`,
      name: menuName,
      image: `/asset/menu/${assetFolder}/${encodeURIComponent(`${menuName}.jpg`.normalize("NFC"))}`,
    })),
  };
}

const sideGroups: MenuGroup[] = [
  fromFolder({
    id: "side-dishes",
    name: "사이드",
    caption: "곁들임 메뉴",
    folder: "사이드/사이드",
    names: ["수육", "순대", "돼지내장볶음"],
  }),
  fromFolder({
    id: "mandu",
    name: "만두",
    caption: "만두",
    folder: "사이드/만두",
    names: ["고기왕만두", "김치왕만두", "반반왕만두", "갈비만두"],
  }),
  fromFolder({
    id: "jeon",
    name: "전",
    caption: "전",
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
    caption: "뚝손국밥",
    folder: "뚝손국밥",
    names: ["돼지국밥", "누룽지돼지국밥", "내장국밥", "순대국밥", "누룽지순대국밥", "황태해장국"],
  }),
  fromFolder({
    id: "clear",
    name: "맑은국밥",
    caption: "맑은 국밥",
    folder: "맑은국밥",
    names: ["맑은돼지국밥"],
  }),
  fromFolder({
    id: "spicy",
    name: "얼큰국밥",
    caption: "얼큰 국밥",
    folder: "얼큰국밥",
    names: ["얼큰돼지국밥", "얼큰누룽지돼지국밥", "얼큰내장국밥", "얼큰순대국밥", "얼큰누룽지순대국밥", "얼큰황태국밥"],
  }),
  fromFolder({
    id: "yukgaejang",
    name: "육개장",
    caption: "육개장",
    folder: "육개장",
    names: ["돈개장", "황태육개장"],
  }),
  {
    id: "side",
    name: "사이드",
    caption: "곁들임 메뉴",
    groups: sideGroups,
    items: sideGroups.flatMap((group) => group.items),
  },
];
