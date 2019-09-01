import { compareTiles, T, Tile, TileCategory, Zihai } from "../tile";

describe("Tile class", () => {
    describe("#createKazuhai", () => {
        it("creates Manzu 1", () => {
            const m1 = Tile.createKazuhai(TileCategory.Manzu, 1);
            expect(m1.name).toBe("m1");
        });

        it("creates Pinzu 3", () => {
            const p3 = Tile.createKazuhai(TileCategory.Pinzu, 3);
            expect(p3.name).toBe("p3");
        });

        it("creates Souzu 9", () => {
            const s9 = Tile.createKazuhai(TileCategory.Souzu, 9);
            expect(s9.name).toBe("s9");
        });

        it("will cause Error with 0", () => {
            expect(() => Tile.createKazuhai(TileCategory.Manzu, 0)).toThrow(Error);
        });

        it("will cause Error with Zihai", () => {
            expect(() => Tile.createKazuhai(TileCategory.Zihai, 5)).toThrow(Error);
        });
    });

    describe("#createZihai", function() {
        test("creates Ton", () => {
            const ton = Tile.createZihai(Zihai.Ton);
            expect(ton.name).toBe(Zihai.Ton);
            expect(ton.category).toBe(TileCategory.Zihai);
        });
    });

    describe("#makeCountMapByOrder", () => {
        test("普通に数える", () => {
            const tiles = [T.m1, T.m1, T.m1, T.s9, T.s9, T.p1, T.p9, T.ew, T.sw];
            const want = new Map<number, number>();
            want.set(T.m1.order, 3);
            want.set(T.s9.order, 2);
            want.set(T.p1.order, 1);
            want.set(T.p9.order, 1);
            want.set(T.ew.order, 1);
            want.set(T.sw.order, 1);
            expect(Tile.makeCountMapByOrder(tiles)).toEqual(want);
        });
    });

    //面子(3つのやつ)探す処理
    describe("#findCompositions", () => {
        test("字牌一面子のパターン", () => {
            const p = [T.ew, T.ew, T.ew];
            const result = Tile.findCompositions(p);
            expect(result).toEqual([[T.ew, T.ew, T.ew]]);
        });
        test("面子足りないパターン", () => {
            const p = [T.ew, T.ew];
            const result = Tile.findCompositions(p);
            expect(result).toEqual([]);
        });
        test("牌が一つも渡されていないパターン", () => {
            const p: Tile[] = [];
            const result = Tile.findCompositions(p);
            expect(result).toEqual([]);
        });
        test("清一色パターン", () => {
            const p = [T.s2, T.s3, T.s3, T.s4, T.s4, T.s5, T.s5, T.s6, T.s6, T.s6, T.s6, T.s7];
            const result = Tile.findCompositions(p);
            expect(result).toEqual([[T.s6, T.s6, T.s6], [T.s2, T.s3, T.s4], [T.s3, T.s4, T.s5], [T.s5, T.s6, T.s7]]);
        });
    });

    describe("#analyzeZihaiSpectrum", () => {
        test("字牌のスペクトラム", () => {
            const p = [T.ew, T.ew, T.ew, T.sw, T.ww, T.nw, T.wd, T.gd, T.rd];
            const result = Tile.analyzeZihaiSpectrum(p);
            const want = [0, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
            expect(result).toEqual(want);
        });
    });

    describe("#analyzeKazuhaiSpectrum", () => {
        test("数牌のスペクトラム", () => {
            const p = [T.m1, T.m1, T.m2, T.m3, T.m3, T.m9, T.m9, T.m9];
            const result = Tile.analyzeKazuhaiSpectrum(p);
            const want = [0, 2, 1, 2, 0, 0, 0, 0, 0, 3];
            expect(result).toEqual(want);
        });
    });

    describe("#pickPongs", () => {
        test("刻子が二つあるパターン", () => {
            const input = [0, 3, 1, 0, 0, 0, 0, 0, 0, 3];
            const [result, left] = Tile.pickPongs(input);
            const wantResult = [[1, 1, 1], [9, 9, 9]];
            const wantLeft = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
            expect(result).toEqual(wantResult);
            expect(left).toEqual(wantLeft);
        });
    });

    describe("#pickChows", () => {
        test("順子が二つあるパターン", () => {
            const input = [0, 1, 1, 2, 1, 1, 0, 0, 0, 1];
            const [result, left] = Tile.pickChows(input);
            const wantResult = [[1, 2, 3], [3, 4, 5]];
            const wantLeft = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
            expect(result).toEqual(wantResult);
            expect(left).toEqual(wantLeft);
        });
    });

    describe("#pickMelds", () => {
        test("清一色パターン", () => {
            const p = [T.s1, T.s1, T.s2, T.s3, T.s3, T.s4, T.s4, T.s5, T.s5, T.s6, T.s6, T.s6, T.s6, T.s7];
            const result = Tile.pickMelds(p);
            expect(result).toEqual([
                [T.s6, T.s6, T.s6],
                [T.s2, T.s3, T.s4],
                [T.s3, T.s4, T.s5],
                [T.s5, T.s6, T.s7],
                [T.s1, T.s1],
            ]);
        });
        test("チャンタ三色頭は字牌", () => {
            const p = [T.nw, T.nw, T.p1, T.p2, T.p3, T.s1, T.s2, T.s3, T.m1, T.m2, T.m3, T.gd, T.gd, T.gd];
            const result = Tile.pickMelds(p);
            expect(result).toEqual([
                [T.m1, T.m2, T.m3],
                [T.p1, T.p2, T.p3],
                [T.s1, T.s2, T.s3],
                [T.gd, T.gd, T.gd],
                [T.nw, T.nw],
            ]);
        });
        test("一部鳴いてるトイトイでシャンポン待ちの時(頭と1面子のみ)", () => {
            const p = [T.nw, T.nw, T.gd, T.gd, T.gd];
            const result = Tile.pickMelds(p);
            expect(result).toEqual([[T.gd, T.gd, T.gd], [T.nw, T.nw]]);
        });
        test("頭のみの場合", () => {
            const p = [T.nw, T.nw];
            const result = Tile.pickMelds(p);
            expect(result).toEqual([[T.nw, T.nw]]);
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
