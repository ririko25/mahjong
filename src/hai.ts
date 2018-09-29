export class Hai {
  name: string;
  order: number;
  red: boolean;
  category: HaiCategory;
  constructor(name: string) {
    this.name = name;
  }

  toString(): string {
    return `${this.name}${this.red ? "(red)" : ""}`;
  }

  private static validateNumber(n: number): boolean {
    return n >= 1 && n <= 9;
  }

  public static createKazuhai(category: HaiCategory, n: number): Hai {
    if (category == HaiCategory.Jihai) {
      throw new Error("ピンズ、マンズ、ソウズ以外のハイを送ってこないでね");
    }

    if (!Hai.validateNumber(n)) {
      throw new Error("number is out of range");
    }
    const name = `${category}${n}`;
    const kh = new Hai(name);
    kh.category = category;
    return kh;
  }

  public static createJihai(name: string): Hai {
    if (!JihaiNames.some((jn) => jn == name)) {
      throw new Error("ありえない字牌の名前だよ");
    }
    const jh = new Hai(name);
    jh.category = HaiCategory.Jihai;
    return jh;
  }
}

export enum HaiCategory {
  Manzu = "m",
  Sozu = "s",
  Pinzu = "p",
  Jihai = "j",
}

export const KazuhaiNames = [
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

export const JihaiNames = ["ton", "nan", "sha", "pei", "haku", "hatu", "tyun"];
