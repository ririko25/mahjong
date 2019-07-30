import { Hand } from "../hand";
import { T } from "../tile";

describe("Hand class", () => {
  describe("#sort", () => {
    test("萬子が1から９まで順番に並ぶ", () => {
      const h = new Hand([T.m2, T.m8, T.m7, T.m4, T.m3, T.m1, T.m6, T.m5, T.m9]);
      h.sort();
      expect(h.tiles).toEqual([T.m1, T.m2, T.m3, T.m4, T.m5, T.m6, T.m7, T.m8, T.m9]);
    });
    test("マンズ、ピンズ、ソウズの順番で並ぶ", () => {
      const h = new Hand([T.p2, T.m8, T.s7]);
      h.sort();
      expect(h.tiles).toEqual([T.m8, T.p2, T.s7]);
    });
    test("東、南、西、北、白、發、中の順番で並ぶ", () => {
      const h = new Hand([T.ww, T.ew, T.wd, T.sw, T.nw, T.gd, T.rd]);
      h.sort();
      expect(h.tiles).toEqual([T.ew, T.sw, T.ww, T.nw, T.wd, T.gd, T.rd]);
    });

    test("マンズ、ピンズ、ソウズの順番で並ぶ。新記述", () => {
      const h = new Hand([T.p2, T.m8, T.s7]);
      h.sort();

      expect(h.tiles).toEqual([T.m8, T.p2, T.s7]);

      // const h2 = Hand.parse("p2,m8,s7|p1,p1,p1|wd,wd,wd,wd");
      // h2.sort();
      // expect(h2.tiles).toEqual(Hand.parse("m8,p2,s7"));
    });
  });

  describe("#copy", () => {
    test("handをcopyする", () => {
      const h1 = new Hand([T.m1, T.s2, T.p1]);
      const h2 = h1.copy();
      expect(h2).toEqual(h1);
      // h1をコピーしたh2をソートしても順番が変わっていないことをチェックする
      h2.sort();
      expect(h1.tiles).toEqual([T.m1, T.s2, T.p1]);
    });
  });

  describe("#canStealPong", () => {
    test("2つ同じ牌が手にあればポン出来る", () => {
      const h = new Hand([T.m1, T.m1, T.m2, T.m3]);
      expect(h.canStealPong(T.m1)).toBe(true);
    });

    test("2つ同じ牌が手に無い時はポン出来ない", () => {
      const h = new Hand([T.m1, T.m2, T.m3, T.m4]);
      expect(h.canStealPong(T.m1)).toBe(false);
    });

    test("3つ同じ牌が手にあってもポン出来る", () => {
      const h = new Hand([T.m1, T.m1, T.m1, T.m2, T.m3]);
      expect(h.canStealPong(T.m1)).toBe(true);
    });
  });
});
