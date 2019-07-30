import { Tile } from "./tile";

export class Hand {
  tiles: Tile[];
  opensets: OpenSet[];
  constructor(tiles: Tile[], ...opensets: OpenSet[]) {
    this.tiles = tiles;
    this.opensets = opensets;
  }
  sort() {
    this.tiles.sort(function(a, b) {
      return a.order - b.order;
    });
  }
  copy(): Hand {
    return new Hand(this.tiles.slice());
  }
  canStealPong(tile: Tile): boolean {
    const countMap = Tile.makeCountMapByOrder(this.tiles);
    const count = countMap.get(tile.order);
    return count !== undefined && count >= 2;
  }
}

// 席の位置
export enum SeatPosition {
  Self = 0,
  Right = 1,
  Across = 2,
  Left = 3,
}

export class OpenSet {
  tiles: Tile[];
  stolenFrom: SeatPosition;
  exposed: boolean; // 暗槓子と明槓子を区別する。明槓子、明刻子などはtrue
  private constructor(tiles: Tile[], stolenFrom: SeatPosition, exposed: boolean) {
    this.tiles = [];
    this.stolenFrom = stolenFrom;
    this.exposed = false;
  }
}
