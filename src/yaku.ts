import { Hand } from "./hand";
import { compareTiles, T, Tile } from "./tile";

export class Yaku {
  public static findCompositions(p: Tile[]): Tile[][] {
    return [p];
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
