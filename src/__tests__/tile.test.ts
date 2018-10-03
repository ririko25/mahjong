import { Tile } from "../tile";
import { TileCategory } from "../tile";
import { Honors } from "../tile";

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
      expect(() => Tile.createSimples(TileCategory.Characters, 0)).toThrow(
        Error,
      );
    });

    it("will cause Error with Honors", () => {
      expect(() => Tile.createSimples(TileCategory.Honors, 5)).toThrow(Error);
    });
  });

  describe("#createHonors", function() {
    test("creates eastwind", () => {
      const ton = Tile.createHonors(Honors.Winds.East);
      expect(ton.name).toBe(Honors.Winds.East);
      expect(ton.category).toBe(TileCategory.Honors);
    });

    it("will cause Error with sangen", () => {
      expect(() => Tile.createHonors("sangen")).toThrow(Error);
    });
  });
});
