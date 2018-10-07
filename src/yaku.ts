import { Hand } from "./hand";
import { Tile } from "./tile";

export class Yaku {
  /**
   * isTiToi ちーといか判定した結果を返す
   * @param h {Hand} - Hand class
   */
  public static isTiToi(h: Hand, tumo: Tile): boolean {
    //1.受け取ったhandを処理用にコピーを作る
    const hc = h.copy();
    //2.ツモを入れて牌をソートする
    hc.tiles.push(tumo);
    hc.sort();
    // 3. opensetsが空
    if (hc.opensets.length != 0) {
      return false;
    }
    // 4. 7種類ある
    const countmap = new Map<string, number>();
    for (const t of hc.tiles) {
      if (countmap.has(t.name)) {
        const c = countmap.get(t.name);
        countmap.set(t.name, c + 1);
      } else {
        countmap.set(t.name, 1);
      }
    }
    // { "wd": 2, "m1": 2, "gd": 3, "s1": 1, "m2": 2, "m3": 2, "s2": 2 }

    if (countmap.size != 7) {
      return false;
    }
    // 5. 牌の組み合わせの種類が、2つずつ同じかを判定する
    for (const c of countmap.values()) {
      if (c != 2) {
        return false;
      }
    }
    return true;
  }
}
