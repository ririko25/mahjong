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
    kh.category = category;
    return kh;
  }

  public static createHonors(name: Honors): Tile {
    const jh = new Tile(name);
    if (name == Honors.EastWind) {
      jh.order = 40;
    }
    if (name == Honors.SouthWind) {
      jh.order = 41;
    }
    if (name == Honors.WestWind) {
      jh.order = 42;
    }
    if (name == Honors.NorthWind) {
      jh.order = 43;
    }
    if (name == Honors.WhiteDragon) {
      jh.order = 44;
    }
    if (name == Honors.GreenDragon) {
      jh.order = 45;
    }
    if (name == Honors.RedDragon) {
      jh.order = 46;
    }
    jh.category = TileCategory.Honors;
    return jh;
  }
}
// ew(東) = 40
//    * sw(南) = 41
//    * ww(西) = 42
//    * nw(北) = 43
//    * wd(白) = 44
//    * gd(發) = 45
//    * rd(中) = 46

export enum TileCategory {
  Honors = "j",
  Bamboo = "s",
  Dots = "p",
  Characters = "m",
}

export const BambooNames = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"];
export const DotsNames = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"];
export const CharactersNames = ["m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8", "m9"];

export const HonorsNames = ["ew", "sw", "ww", "nw", "wd", "gd", "rd"];
export enum Honors {
  EastWind = "ew",
  SouthWind = "sw",
  WestWind = "ww",
  NorthWind = "nw",
  WhiteDragon = "wd",
  GreenDragon = "gd",
  RedDragon = "rd",
}
/**
 * ハイを一つづつ生成できるようにした。
 * tile objectの生成を簡略化した。
 */
export const T: {
  [key: string]: Tile;
} = {
  M1: Tile.createSimples(TileCategory.Characters, 1),
  M2: Tile.createSimples(TileCategory.Characters, 2),
  M3: Tile.createSimples(TileCategory.Characters, 3),
  M4: Tile.createSimples(TileCategory.Characters, 4),
  M5: Tile.createSimples(TileCategory.Characters, 5),
  M6: Tile.createSimples(TileCategory.Characters, 6),
  M7: Tile.createSimples(TileCategory.Characters, 7),
  M8: Tile.createSimples(TileCategory.Characters, 8),
  M9: Tile.createSimples(TileCategory.Characters, 9),

  P1: Tile.createSimples(TileCategory.Dots, 1),
  P2: Tile.createSimples(TileCategory.Dots, 2),
  P3: Tile.createSimples(TileCategory.Dots, 3),
  P4: Tile.createSimples(TileCategory.Dots, 4),
  P5: Tile.createSimples(TileCategory.Dots, 5),
  P6: Tile.createSimples(TileCategory.Dots, 6),
  P7: Tile.createSimples(TileCategory.Dots, 7),
  P8: Tile.createSimples(TileCategory.Dots, 8),
  P9: Tile.createSimples(TileCategory.Dots, 9),

  S1: Tile.createSimples(TileCategory.Bamboo, 1),
  S2: Tile.createSimples(TileCategory.Bamboo, 2),
  S3: Tile.createSimples(TileCategory.Bamboo, 3),
  S4: Tile.createSimples(TileCategory.Bamboo, 4),
  S5: Tile.createSimples(TileCategory.Bamboo, 5),
  S6: Tile.createSimples(TileCategory.Bamboo, 6),
  S7: Tile.createSimples(TileCategory.Bamboo, 7),
  S8: Tile.createSimples(TileCategory.Bamboo, 8),
  S9: Tile.createSimples(TileCategory.Bamboo, 9),

  EW: Tile.createHonors(Honors.EastWind),
  SW: Tile.createHonors(Honors.SouthWind),
  WW: Tile.createHonors(Honors.WestWind),
  NW: Tile.createHonors(Honors.NorthWind),
  WD: Tile.createHonors(Honors.WhiteDragon),
  GD: Tile.createHonors(Honors.GreenDragon),
  RD: Tile.createHonors(Honors.RedDragon),
};
