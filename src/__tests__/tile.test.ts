import { Tile, T, TileCategory, Honors, compareTiles } from "../tile";

describe("Tile class", () => {
  describe("#createSimples", () => {
    it("creates Characters 1", () => {
      const m1 = Tile.createSimples(TileCategory.Characters, 1);
      expect(m1.name).toBe("m1");
    });

    it("creates Dots 3", () => {
      const p3 = Tile.createSimples(TileCategory.Dots, 3);
      expect(p3.name).toBe("p3");
    });

    it("creates Bamboo 9", () => {
      const s9 = Tile.createSimples(TileCategory.Bamboo, 9);
      expect(s9.name).toBe("s9");
    });

    it("will cause Error with 0", () => {
      expect(() => Tile.createSimples(TileCategory.Characters, 0)).toThrow(Error);
    });

    it("will cause Error with Honors", () => {
      expect(() => Tile.createSimples(TileCategory.Honors, 5)).toThrow(Error);
    });
  });

  describe("#createHonors", function() {
    test("creates eastwind", () => {
      const ton = Tile.createHonors(Honors.EastWind);
      expect(ton.name).toBe(Honors.EastWind);
      expect(ton.category).toBe(TileCategory.Honors);
    });
  });
});

describe("Tile funcitons", () => {
  describe("#compareTiles", () => {
    test("同じ順番で中身も一緒の配列ならtrue", () => {
      const tiles1 = [T.m1, T.m9, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      const tiles2 = [T.m1, T.m9, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      expect(compareTiles(tiles1, tiles2)).toBe(true);
    });
    test("長さが違う配列ならfalse", () => {
      const tiles1 = [T.m1, T.m9, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      const tiles2 = [T.m9, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      expect(compareTiles(tiles1, tiles2)).toBe(false);
    });
    test("同じ中身でも順番が違えばfalse", () => {
      const tiles1 = [T.m9, T.m1, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      const tiles2 = [T.m1, T.m9, T.s1, T.s9, T.p1, T.p9, T.ew, T.sw, T.ew, T.nw, T.rd, T.gd, T.wd];
      expect(compareTiles(tiles1, tiles2)).toBe(false);
    });
  });
});
