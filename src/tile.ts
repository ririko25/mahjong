export class Tile {
    name: string;
    /**
     * m1-m9(マンズ) = 11-19
     * p1-p9(ピンズ) = 21-29
     * s1-s9(ソウズ) = 31-39
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
        this.order = 0;
        this.red = false;
        this.category = TileCategory.Souzu;
    }

    toString(): string {
        return `${this.name}${this.red ? "(red)" : ""}`;
    }

    private static validateNumber(n: number): boolean {
        return n >= 1 && n <= 9;
    }

    public static createKazuhai(category: TileCategory, n: number): Tile {
        if (category == TileCategory.Zihai) {
            throw new Error("ピンズ、マンズ、ソウズ以外のハイを送ってこないでね");
        }

        if (!Tile.validateNumber(n)) {
            throw new Error("number is out of range");
        }
        const name = `${category}${n}`;
        const kh = new Tile(name);
        let o = n;
        if (category == TileCategory.Manzu) {
            o = o + 10;
        } else if (category == TileCategory.Pinzu) {
            o = o + 20;
        } else if (category == TileCategory.Souzu) {
            o = o + 30;
        }
        kh.order = o;
        kh.category = category;
        return kh;
    }

    public static createZihai(name: Zihai): Tile {
        const jh = new Tile(name);
        if (name == Zihai.Ton) {
            jh.order = 40;
        }
        if (name == Zihai.Nan) {
            jh.order = 41;
        }
        if (name == Zihai.Sha) {
            jh.order = 42;
        }
        if (name == Zihai.Pei) {
            jh.order = 43;
        }
        if (name == Zihai.Haku) {
            jh.order = 44;
        }
        if (name == Zihai.Hatu) {
            jh.order = 45;
        }
        if (name == Zihai.Chun) {
            jh.order = 46;
        }
        jh.category = TileCategory.Zihai;
        return jh;
    }

    public static createZihaiFromIndex(index: number): Tile {
        return this.createZihai(ZihaiNames[index]);
    }

    public static fromName(name: string): Tile {
        return tileNameMap[name];
    }

    // orderごとの牌の数を数えてMap形式にする
    public static makeCountMapByOrder(tiles: Tile[]): Map<number, number> {
        const countMap: Map<number, number> = new Map();
        tiles.forEach((t) => {
            const cur = countMap.get(t.order);
            if (cur) {
                countMap.set(t.order, cur + 1);
            } else {
                countMap.set(t.order, 1);
            }
        });

        return countMap;
    }

    //ヤオチュウハイならtrueを返す
    public static isOrphanOrder(order: number): boolean {
        if (order === 11) return true;
        if (order === 19) return true;
        if (order === 21) return true;
        if (order === 29) return true;
        if (order === 31) return true;
        if (order === 39) return true;
        if (order === 40) return true;
        if (order === 41) return true;
        if (order === 42) return true;
        if (order === 43) return true;
        if (order === 44) return true;
        if (order === 45) return true;
        if (order === 46) return true;
        return false;
    }
}

export enum TileCategory {
    Zihai = "j",
    Souzu = "s",
    Pinzu = "p",
    Manzu = "m",
}

export enum Zihai {
    Ton = "ew",
    Nan = "sw",
    Sha = "ww",
    Pei = "nw",
    Haku = "wd",
    Hatu = "gd",
    Chun = "rd",
}

export const ZihaiNames = [Zihai.Ton, Zihai.Nan, Zihai.Sha, Zihai.Pei, Zihai.Haku, Zihai.Hatu, Zihai.Chun];
/**
 * ハイを一つづつ生成できるようにした。
 * tile objectの生成を簡略化した。
 */
export const T = {
    m1: Tile.createKazuhai(TileCategory.Manzu, 1),
    m2: Tile.createKazuhai(TileCategory.Manzu, 2),
    m3: Tile.createKazuhai(TileCategory.Manzu, 3),
    m4: Tile.createKazuhai(TileCategory.Manzu, 4),
    m5: Tile.createKazuhai(TileCategory.Manzu, 5),
    m6: Tile.createKazuhai(TileCategory.Manzu, 6),
    m7: Tile.createKazuhai(TileCategory.Manzu, 7),
    m8: Tile.createKazuhai(TileCategory.Manzu, 8),
    m9: Tile.createKazuhai(TileCategory.Manzu, 9),

    p1: Tile.createKazuhai(TileCategory.Pinzu, 1),
    p2: Tile.createKazuhai(TileCategory.Pinzu, 2),
    p3: Tile.createKazuhai(TileCategory.Pinzu, 3),
    p4: Tile.createKazuhai(TileCategory.Pinzu, 4),
    p5: Tile.createKazuhai(TileCategory.Pinzu, 5),
    p6: Tile.createKazuhai(TileCategory.Pinzu, 6),
    p7: Tile.createKazuhai(TileCategory.Pinzu, 7),
    p8: Tile.createKazuhai(TileCategory.Pinzu, 8),
    p9: Tile.createKazuhai(TileCategory.Pinzu, 9),

    s1: Tile.createKazuhai(TileCategory.Souzu, 1),
    s2: Tile.createKazuhai(TileCategory.Souzu, 2),
    s3: Tile.createKazuhai(TileCategory.Souzu, 3),
    s4: Tile.createKazuhai(TileCategory.Souzu, 4),
    s5: Tile.createKazuhai(TileCategory.Souzu, 5),
    s6: Tile.createKazuhai(TileCategory.Souzu, 6),
    s7: Tile.createKazuhai(TileCategory.Souzu, 7),
    s8: Tile.createKazuhai(TileCategory.Souzu, 8),
    s9: Tile.createKazuhai(TileCategory.Souzu, 9),

    ew: Tile.createZihai(Zihai.Ton),
    sw: Tile.createZihai(Zihai.Nan),
    ww: Tile.createZihai(Zihai.Sha),
    nw: Tile.createZihai(Zihai.Pei),
    wd: Tile.createZihai(Zihai.Haku),
    gd: Tile.createZihai(Zihai.Hatu),
    rd: Tile.createZihai(Zihai.Chun),
};

type tileNameMapType = { [key: string]: Tile };

const tileNameMap: tileNameMapType = {
    m1: T.m1,
    m2: T.m2,
    m3: T.m3,
    m4: T.m4,
    m5: T.m5,
    m6: T.m6,
    m7: T.m7,
    m8: T.m8,
    m9: T.m9,
    p1: T.p1,
    p2: T.p2,
    p3: T.p3,
    p4: T.p4,
    p5: T.p5,
    p6: T.p6,
    p7: T.p7,
    p8: T.p8,
    p9: T.p9,
    s1: T.s1,
    s2: T.s2,
    s3: T.s3,
    s4: T.s4,
    s5: T.s5,
    s6: T.s6,
    s7: T.s7,
    s8: T.s8,
    s9: T.s9,
    ew: T.ew,
    sw: T.sw,
    ww: T.ww,
    nw: T.nw,
    wd: T.wd,
    gd: T.gd,
    rd: T.rd,
};

/**
 * 国士無双を作るとき、配列同士の比較をしたかったのに比較するためのメソッドがなかったので作りました。
 * 牌が入った配列の中身を数、種類、順番で他の配列の中身と比較することとができる。
 */
export function compareTiles(tiles1: Tile[], tiles2: Tile[]): boolean {
    if (!tiles1 || !tiles2) {
        return false;
    }
    if (tiles1.length != tiles2.length) {
        return false;
    }
    for (let i = 0; i < tiles1.length; i++) {
        if (tiles1[i].name != tiles2[i].name) {
            return false;
        }
    }
    return true;
}
