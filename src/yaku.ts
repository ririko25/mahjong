import { Hand } from "./hand";
import { compareTiles, T, Tile, TileCategory } from "./tile";

export class Yaku {
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

    /**
     * isTiToi ちーといか判定した結果を返す
     * @param h {Hand} - 手牌
     */
    public static isTiToi(h: Hand): boolean {
        //1.受け取ったhandを処理用にコピーを作る
        const hc = h.copy();
        //2.牌をソートする
        hc.sort();
        // 3. opensetsが空
        if (hc.opensets.length !== 0) {
            return false;
        }
        // 4. 7種類ある
        const countmap = new Map<string, number>();
        for (const t of hc.tiles) {
            if (countmap.has(t.name)) {
                const c = countmap.get(t.name);
                if (c) {
                    countmap.set(t.name, c + 1);
                }
            } else {
                countmap.set(t.name, 1);
            }
        }
        // { "wd": 2, "m1": 2, "gd": 3, "s1": 1, "m2": 2, "m3": 2, "s2": 2 }

        if (countmap.size !== 7) {
            return false;
        }
        // 5. 牌の組み合わせの種類が、2つずつ同じかを判定する
        for (const c of countmap.values()) {
            if (c !== 2) {
                return false;
            }
        }
        return true;
    }

    /**
     * isKokushi 国士無双か判定した結果を返す
     * @param h {Hand} - 手牌
     */
    public static isKokushi(h: Hand): boolean {
        //1.受け取ったhandを処理用にコピーを作る
        const hc = h.copy();
        //2.牌をソートする
        hc.sort();
        // 3. opensetsが空
        if (hc.opensets.length !== 0) {
            return false;
        }

        //13面待ち状態を用意する
        const thirteen = [T.m1, T.m9, T.p1, T.p9, T.s1, T.s9, T.ew, T.sw, T.ww, T.nw, T.wd, T.gd, T.rd];

        const list = thirteen.map((t) => thirteen.concat(t).sort((a, b) => a.order - b.order));
        for (const a of list) {
            if (compareTiles(a, hc.tiles)) {
                return true;
            }
        }
        return false;
    }
}
