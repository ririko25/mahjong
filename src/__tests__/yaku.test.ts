import { Hand } from "../hand";
import { T, Tile } from "../tile";
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

    // TODO あとで作る 上がり形かどうかを判定
    // describe("#isLegal", () => {
    //   test("",)
    // });

    //面子(3つのやつ)探す処理
    describe("#findCompositions", () => {
        test("字牌一面子のパターン", () => {
            const p = [T.ew, T.ew, T.ew];
            const result = Yaku.findCompositions(p);
            expect(result).toEqual([[T.ew, T.ew, T.ew]]);
        });
        test("面子足りないパターン", () => {
            const p = [T.ew, T.ew];
            const result = Yaku.findCompositions(p);
            expect(result).toEqual([]);
        });
        test("牌が一つも渡されていないパターン", () => {
            const p: Tile[] = [];
            const result = Yaku.findCompositions(p);
            expect(result).toEqual([]);
        });
        test("清一色パターン", () => {
            const p = [T.s2, T.s3, T.s3, T.s4, T.s4, T.s5, T.s5, T.s6, T.s6, T.s6, T.s6, T.s7];
            const result = Yaku.findCompositions(p);
            expect(result).toEqual([[T.s6, T.s6, T.s6], [T.s2, T.s3, T.s4], [T.s3, T.s4, T.s5], [T.s5, T.s6, T.s7]]);
        });
    });

    describe("#analyzeZihaiSpectrum", () => {
        test("字牌のスペクトラム", () => {
            const p = [T.ew, T.ew, T.ew, T.sw, T.ww, T.nw, T.wd, T.gd, T.rd];
            const result = Yaku.analyzeZihaiSpectrum(p);
            const want = [0, 3, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];
            expect(result).toEqual(want);
        });
    });

    describe("#analyzeKazuhaiSpectrum", () => {
        test("数牌のスペクトラム", () => {
            const p = [T.m1, T.m1, T.m2, T.m3, T.m3, T.m9, T.m9, T.m9];
            const result = Yaku.analyzeKazuhaiSpectrum(p);
            const want = [0, 2, 1, 2, 0, 0, 0, 0, 0, 3];
            expect(result).toEqual(want);
        });
    });

    describe("#pickPongs", () => {
        test("刻子が二つあるパターン", () => {
            const input = [0, 3, 1, 0, 0, 0, 0, 0, 0, 3];
            const [result, left] = Yaku.pickPongs(input);
            const wantResult = [[1, 1, 1], [9, 9, 9]];
            const wantLeft = [0, 0, 1, 0, 0, 0, 0, 0, 0, 0];
            expect(result).toEqual(wantResult);
            expect(left).toEqual(wantLeft);
        });
    });

    describe("#pickChows", () => {
        test("順子が二つあるパターン", () => {
            const input = [0, 1, 1, 2, 1, 1, 0, 0, 0, 1];
            const [result, left] = Yaku.pickChows(input);
            const wantResult = [[1, 2, 3], [3, 4, 5]];
            const wantLeft = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
            expect(result).toEqual(wantResult);
            expect(left).toEqual(wantLeft);
        });
    });

    describe("#pickMelds", () => {
        test("清一色パターン", () => {
            const p = [T.s1, T.s1, T.s2, T.s3, T.s3, T.s4, T.s4, T.s5, T.s5, T.s6, T.s6, T.s6, T.s6, T.s7];
            const result = Yaku.pickMelds(p);
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
            const result = Yaku.pickMelds(p);
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
            const result = Yaku.pickMelds(p);
            expect(result).toEqual([[T.gd, T.gd, T.gd], [T.nw, T.nw]]);
        });
        test("頭のみの場合", () => {
            const p = [T.nw, T.nw];
            const result = Yaku.pickMelds(p);
            expect(result).toEqual([[T.nw, T.nw]]);
        });
    });
});
