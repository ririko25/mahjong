import { T } from "../tile";
import { Hand } from "../hand";

describe("Hand class", () => {
  describe("#sort", () => {
    test("萬子が1から９まで順番に並ぶ", () => {
      const h = new Hand([T.M2, T.M8, T.M7, T.M4, T.M3, T.M1, T.M6, T.M5, T.M9]);
      h.sort();
      expect(h.tiles).toEqual([T.M1, T.M2, T.M3, T.M4, T.M5, T.M6, T.M7, T.M8, T.M9]);
    });
    test("マンズ、ピンズ、ソウズの順番で並ぶ", () => {
      const h = new Hand([T.P2, T.M8, T.S7]);
      h.sort();
      expect(h.tiles).toEqual([T.M8, T.P2, T.S7]);
    });
    test("東、南、西、北、白、發、中の順番で並ぶ", () => {
      const h = new Hand([T.WW, T.EW, T.WD, T.SW, T.NW, T.GD, T.RD]);
      h.sort();
      expect(h.tiles).toEqual([T.EW, T.SW, T.WW, T.NW, T.WD, T.GD, T.RD]);
    });

    test("マンズ、ピンズ、ソウズの順番で並ぶ。新記述", () => {
      const h = new Hand([T.P2, T.M8, T.S7]);
      h.sort();

      expect(h.tiles).toEqual([T.M8, T.P2, T.S7]);

      // const h2 = Hand.parse("p2,m8,s7|p1,p1,p1|wd,wd,wd,wd");
      // h2.sort();
      // expect(h2.tiles).toEqual(Hand.parse("m8,p2,s7"));
    });
  });
});
