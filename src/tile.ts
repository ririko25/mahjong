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

    // 上がり形候補が1つに絞れる前提で、返り値は候補を1セットだけ返すように作っておく
    // 得点計算が判断に必要となった場合は、3次元配列で複数候補を返せるようにする
    public static pickMelds(tiles: Tile[]): Tile[][] {
        // 頭を抜き出す
        const eyesList = this.makeEyesList(tiles);

        for (const eye of eyesList) {
            const noEyes = this.removeEyes(eye, tiles);

            // 種類別に分ける
            // findCompositionsを使って面子を取り出す
            const splited = this.splitByCategory(noEyes);
            const melds: Tile[][] = [];
            for (const s of splited) {
                const moge = this.findCompositions(s);
                melds.push(...moge);
            }
            // 面子が4つ揃ってるか確認
            if (melds.length === noEyes.length / 3) {
                melds.push([eye, eye]);
                return melds;
            }
        }

        return [];
    }

    public static makeEyesList(tiles: Tile[]): Tile[] {
        const countMap: Map<string, number> = new Map();
        tiles.forEach((t) => {
            const cur = countMap.get(t.name);
            if (cur) {
                countMap.set(t.name, cur + 1);
            } else {
                countMap.set(t.name, 1);
            }
        });

        const eyesList: Tile[] = [];
        countMap.forEach((count, name) => {
            if (count >= 2) {
                eyesList.push(Tile.fromName(name));
            }
        });
        return eyesList;
    }

    // tilesには影響を与えない
    private static removeEyes(eye: Tile, tiles: Tile[]): Tile[] {
        const copyTiles = tiles.slice().sort((a, b) => a.order - b.order);
        const i = copyTiles.findIndex((t) => t.name === eye.name);
        // ソート済みなので、2個まとめて消す
        copyTiles.splice(i, 2);
        return copyTiles;
    }

    private static splitByCategory(tiles: Tile[]): Tile[][] {
        const charactors: Tile[] = [];
        const Pinzu: Tile[] = [];
        const Souzu: Tile[] = [];
        const Zihai: Tile[] = [];

        tiles.forEach((t) => {
            if (t.category === TileCategory.Zihai) {
                Zihai.push(t);
            } else if (t.category === TileCategory.Pinzu) {
                Pinzu.push(t);
            } else if (t.category === TileCategory.Souzu) {
                Souzu.push(t);
            } else if (t.category === TileCategory.Manzu) {
                charactors.push(t);
            }
        });

        return [charactors, Pinzu, Souzu, Zihai];
    }

    /**
     * 同じ種類の牌から面子を見つける
     * 呼ぶ前に牌のカテゴリーを1種類にしておく必要がある
     * @param tiles
     * @returns compositions
     */
    public static findCompositions(tiles: Tile[]): Tile[][] {
        if (tiles.length === 0) {
            return [];
        }
        const category = tiles[0].category;
        const spectrum =
            category === TileCategory.Zihai ? this.analyzeZihaiSpectrum(tiles) : this.analyzeKazuhaiSpectrum(tiles);

        // 刻子、順子の順で抜き出す場合と順子、刻子の順で抜き出す場合の両方を試してみる
        // (順序によって正しく取れない場合がある為)
        let result: number[][];
        let left: number[];
        const resultPongChow: number[][] = [];
        [result, left] = this.pickPongs(spectrum);
        result.forEach((r) => resultPongChow.push(r));
        [result, left] = this.pickChows(left);
        result.forEach((r) => resultPongChow.push(r));

        const resultChowPong: number[][] = [];
        [result, left] = this.pickChows(spectrum);
        result.forEach((r) => resultChowPong.push(r));
        [result, left] = this.pickPongs(spectrum);
        result.forEach((r) => resultChowPong.push(r));

        const largest = resultPongChow.length >= resultChowPong.length ? resultPongChow : resultChowPong;

        return largest.map((r) =>
            r.map((t) => {
                if (category === TileCategory.Zihai) {
                    const index = (t - 1) / 2;
                    return Tile.createZihaiFromIndex(index);
                }

                return Tile.createKazuhai(category, t);
            })
        );
    }

    public static analyzeZihaiSpectrum(tiles: Tile[]): number[] {
        const spectrum: number[] = [];
        for (let i = 0; i < 14; i++) {
            spectrum[i] = 0;
        }

        tiles.forEach((t) => {
            const index = (t.order % 40) * 2 + 1;
            spectrum[index]++;
        });
        return spectrum;
    }

    public static analyzeKazuhaiSpectrum(tiles: Tile[]): number[] {
        const spectrum: number[] = [];
        for (let i = 0; i < 10; i++) {
            spectrum[i] = 0;
        }

        tiles.forEach((t) => {
            const index = t.order % 10;
            spectrum[index]++;
        });
        return spectrum;
    }

    public static pickPongs(spectrum: number[]): [number[][], number[]] {
        const result: number[][] = [];
        const left = Array.from(spectrum);
        for (let i = 0; i < left.length; i++) {
            if (left[i] >= 3) {
                left[i] -= 3;
                result.push([i, i, i]);
            }
        }
        return [result, left];
    }

    public static pickChows(spectrum: number[]): [number[][], number[]] {
        const result: number[][] = [];
        const left = Array.from(spectrum);
        for (let i = 0; i < left.length - 2; i++) {
            if (left[i] >= 1 && left[i + 1] >= 1 && left[i + 2] >= 1) {
                left[i] -= 1;
                left[i + 1] -= 1;
                left[i + 2] -= 1;
                result.push([i, i + 1, i + 2]);
            }
        }
        return [result, left];
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
