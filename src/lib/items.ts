export interface CalculatorItem {
  id: string;
  amount: number;
}

export type FullItem = GameItem & CalculatorItem;

export enum ItemCategory {
  VEHICLE = "vehicle",
  SPOILER = "spoiler",
  RIM = "rim",
  TEXTURE = "texture",
  COLOR = "color",
  HYPER = "hyper",
}

export interface GameItem {
  id: string;
  name: string;
  value: number;
  imageUrl: string;
  category: ItemCategory;
}

interface JBVResponse {
  [id: string]: {
    name: string;
    value: number;
  };
}
export function mapJbvResponse(response: JBVResponse): GameItem[] {
  const categoryMap = {
    v: ItemCategory.VEHICLE,
    r: ItemCategory.RIM,
    s: ItemCategory.SPOILER,
    t: ItemCategory.TEXTURE,
    c: ItemCategory.COLOR,
    hyper: ItemCategory.HYPER,
  };

  return Object.entries(response)
    .map(([id, data]) => {
      let category = null;
      const prefix = Object.keys(categoryMap).find((key) => id.startsWith(key));

      if (prefix) {
        category = categoryMap[prefix as keyof typeof categoryMap];
      }

      if (!category) throw new Error("failed to match item category");

      return {
        id,
        name: data.name,
        value: data.value,
        imageUrl: `https://jbvalues.com/images/itemimages/${id}.webp`,
        category,
      };
    })
    .filter((item) => item.value !== 0 && !item.id.includes("duped"));
}
