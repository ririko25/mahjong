import { Hai } from "../hai";
import { HaiCategory } from "../hai";

describe("#createKazuhai", () => {
  it("creates Manzu 1", () => {
    const m1 = Hai.createKazuhai(HaiCategory.Manzu, 1);
    expect(m1.name).toBe("m1");
  });

  it("creates Pinzu 3", () => {
    const p3 = Hai.createKazuhai(HaiCategory.Pinzu, 3);
    expect(p3.name).toBe("p3");
  });

  it("creates Sozu 9", () => {
    const s9 = Hai.createKazuhai(HaiCategory.Sozu, 9);
    expect(s9.name).toBe("s9");
  });

  it("will cause Error with 0", () => {
    expect(() => Hai.createKazuhai(HaiCategory.Manzu, 0)).toThrow(Error);
  });

  it("will cause Error with Jihai", () => {
    expect(() => Hai.createKazuhai(HaiCategory.Jihai, 5)).toThrow(Error);
  });
});

describe("#createJihai", function() {
  test("creates ton", () => {
    const ton = Hai.createJihai("ton");
    expect(ton.name).toBe("ton");
    expect(ton.category).toBe(HaiCategory.Jihai);
  });

  it("will cause Error with sangen", () => {
    expect(() => Hai.createJihai("sangen")).toThrow(Error);
  });
});
