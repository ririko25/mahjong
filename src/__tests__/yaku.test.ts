import { Hand } from "../hand";
import { T } from "../tile";
import { Yaku } from "../yaku";

describe("Yaku class", () => {
  describe("#isTiToi", () => {
    test("牌が2つづつ、7種類の組み合わせになってたらtrue", () => {
      const h = new Hand([T.m2, T.m2, T.m3, T.m3, T.m5, T.m5, T.p6, T.p6, T.s9, T.s9, T.ew, T.ew, T.wd, T.wd]);
      const result = Yaku.isTiToi(h);
      expect(result).toBe(true);
    });
    test("牌が2つづつ、7種類の組み合わせではなかったらfalse", () => {
      const h = new Hand([T.m2, T.m2, T.m3, T.m3, T.m5, T.m5, T.p6, T.p6, T.s9, T.s9, T.wd, T.wd, T.wd, T.wd]);
      const result = Yaku.isTiToi(h);
      expect(result).toBe(false);
    });
  });

  describe("#isKokushi", () => {
    test("国士無双が成立したらtrue", () => {
      const h = new Hand([T.m1, T.m9, T.p1, T.p9, T.s1, T.s9, T.ew, T.sw, T.ww, T.nw, T.wd, T.gd, T.rd, T.s1]);
      const result = Yaku.isKokushi(h);
      expect(result).toBe(true);
    });
    test("国士無双が不成立ならfalse", () => {
      const h = new Hand([T.m1, T.m9, T.p1, T.p9, T.s1, T.s9, T.ew, T.sw, T.ew, T.nw, T.wd, T.gd, T.rd, T.m2]);
      const result = Yaku.isKokushi(h);
      expect(result).toBe(false);
    });
  });
});
