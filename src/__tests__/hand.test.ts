import { Tile, TileCategory, Honors } from "../tile";
import { Hand } from "../hand";

describe("Hand class", () => {
  describe("#sort", () => {
    test("萬子が1から９まで順番に並ぶ", () => {
      const m1 = Tile.createSimples(TileCategory.Characters, 1);
      const m2 = Tile.createSimples(TileCategory.Characters, 2);
      const m3 = Tile.createSimples(TileCategory.Characters, 3);
      const m4 = Tile.createSimples(TileCategory.Characters, 4);
      const m5 = Tile.createSimples(TileCategory.Characters, 5);
      const m6 = Tile.createSimples(TileCategory.Characters, 6);
      const m7 = Tile.createSimples(TileCategory.Characters, 7);
      const m8 = Tile.createSimples(TileCategory.Characters, 8);
      const m9 = Tile.createSimples(TileCategory.Characters, 9);
      const h = new Hand([m2, m8, m7, m4, m3, m1, m6, m5, m9]);
      h.sort();
      expect(h.tiles).toEqual([m1, m2, m3, m4, m5, m6, m7, m8, m9]);
    });
    test("マンズ、ピンズ、ソウズの順番で並ぶ", () => {
      const p2 = Tile.createSimples(TileCategory.Dots, 2);
      const m8 = Tile.createSimples(TileCategory.Characters, 8);
      const s7 = Tile.createSimples(TileCategory.Bamboo, 7);
      const h = new Hand([p2, m8, s7]);
      h.sort();
      expect(h.tiles).toEqual([m8, p2, s7]);
    });
    test("東、南、西、北、白、發、中の順番で並ぶ", () => {
      const ew = Tile.createHonors(Honors.EastWind);
      const sw = Tile.createHonors(Honors.SouthWind);
      const ww = Tile.createHonors(Honors.WestWind);
      const nw = Tile.createHonors(Honors.NorthWind);
      const wd = Tile.createHonors(Honors.WhiteDragon);
      const gd = Tile.createHonors(Honors.GreenDragon);
      const rd = Tile.createHonors(Honors.RedDragon);
      const h = new Hand([ww, ew, wd, sw, nw, gd, rd]);
      h.sort();
      expect(h.tiles).toEqual([ew, sw, ww, nw, wd, gd, rd]);
    });
  });
});
