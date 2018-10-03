import { Tile, TileCategory } from "../tile";
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
    test("マンズ、ピンズ、zソウズの順番で並ぶ", () => {
      const p2 = Tile.createSimples(TileCategory.Dots, 2);
      const m8 = Tile.createSimples(TileCategory.Characters, 8);
      const s7 = Tile.createSimples(TileCategory.Bamboo, 7);
      const h = new Hand([p2, m8, s7]);
      h.sort();
      expect(h.tiles).toEqual([m8, p2, s7]);
    });
  });
});
