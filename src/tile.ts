export class Tile {
  name: string;
  order: number;
  red: boolean;
  category: TileCategory;
  constructor(name: string) {
    this.name = name;
  }

  toString(): string {
    return `${this.name}${this.red ? "(red)" : ""}`;
  }

  private static validateNumber(n: number): boolean {
    return n >= 1 && n <= 9;
  }

  public static createSimples(category: TileCategory, n: number): Tile {
    if (category == TileCategory.Honors) {
      throw new Error("ピンズ、マンズ、ソウズ以外のハイを送ってこないでね");
    }

    if (!Tile.validateNumber(n)) {
      throw new Error("number is out of range");
    }
    const name = `${category}${n}`;
    const kh = new Tile(name);
    kh.category = category;
    return kh;
  }

  public static createHonors(name: string): Tile {
    if (!HonorsNames.some((jn) => jn == name)) {
      throw new Error("ありえない字牌の名前だよ");
    }
    const jh = new Tile(name);
    jh.category = TileCategory.Honors;
    return jh;
  }
}

export enum TileCategory {
  Characters = "m",
  Bamboo = "s",
  Dots = "p",
  Honors = "j",
}

export const SimplesNames = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
];

export const HonorsNames = ["ew", "sw", "ww", "nw", "wd", "gd", "rd"];
export const Honors = {
  Winds: {
    East: "ew",
    West: "ww",
    South: "sw",
    North: "nw",
  },
  Dragons: {
    White: "wd",
    Green: "gd",
    Red: "rd",
  },
};
