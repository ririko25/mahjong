export class Tile {
  name: string;
  /**
   * m1~m9(マンズ) = 11~19
   * p1~p9(ピンズ) = 21~29
   * s1~s9(ソウズ) = 31~39
   * ew(東) = 40
   * sw(南) = 41
   * ww(西) = 42
   * nw(北) = 43
   * wd(白) = 44
   * gd(發) = 45
   * rd(中) = 46
   **/
  order: number;
  red: boolean;
  category: TileCategory;
  private constructor(name: string) {
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
    let o = n;
    if (category == TileCategory.Characters) {
      o = o + 10;
    } else if (category == TileCategory.Dots) {
      o = o + 20;
    } else if (category == TileCategory.Bamboo) {
      o = o + 30;
    }
    kh.order = o;
    //   m1~m9(マンズ) = 11~19
    //   p1~p9(ピンズ) = 21~29
    //   s1~s9(ソウズ) = 31~39
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
  Honors = "j",
  Bamboo = "s",
  Dots = "p",
  Characters = "m",
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
    South: "sw",
    West: "ww",
    North: "nw",
  },
  Dragons: {
    White: "wd",
    Green: "gd",
    Red: "rd",
  },
};
