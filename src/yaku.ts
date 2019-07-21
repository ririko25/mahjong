import { Hand } from "./hand";
import { compareTiles, T, Tile, TileCategory } from "./tile";

export class Yaku {
  /**
   * 同じ種類の牌から面子を見つける
   * 呼ぶ前に牌のカテゴリーを1種類にしておく必要がある
   * @param tiles
   * @returns compositions
   */
  public static findCompositions(tiles: Tile[]): Tile[][] {
    const category = tiles[0].category;
    const spectrum =
      category === TileCategory.Honors ? this.analyzeHonorsSpectrum(tiles) : this.analyzeSimplesSpectrum(tiles);

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
        if (category === TileCategory.Honors) {
          const index = (t - 1) / 2;
          return Tile.createHonorsFromIndex(index);
        }

        return Tile.createSimples(category, t);
      })
    );
  }

  public static analyzeHonorsSpectrum(tiles: Tile[]): number[] {
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

  public static analyzeSimplesSpectrum(tiles: Tile[]): number[] {
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
