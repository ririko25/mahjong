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
  canStealKong(tile: Tile): boolean {
    const countMap = Tile.makeCountMapByOrder(this.tiles);
    const count = countMap.get(tile.order);
    return count !== undefined && count >= 3;
  }

  listChowTiles(tile: Tile): Tile[][] {
    const chowTiles: Tile[][] = [];
    const countMap = Tile.makeCountMapByOrder(this.tiles);
    //リャンメン右処理
    const hasLeftSides = countMap.has(tile.order - 1) && countMap.has(tile.order - 2);
    if (hasLeftSides) {
      const chowPair: Tile[] = [];
      const left2 = this.tiles.find((t) => t.order === tile.order - 2);
      const left1 = this.tiles.find((t) => t.order === tile.order - 1);
      if (left2 && left1) {
        chowPair.push(left2, left1);
        chowTiles.push(chowPair);
      }
    }
    //カンチャン処理
    const hasBothSides = countMap.has(tile.order - 1) && countMap.has(tile.order + 1);
    if (hasBothSides) {
      const chowPair: Tile[] = [];
      const leftSide = this.tiles.find((t) => t.order === tile.order - 1);
      const rightSide = this.tiles.find((t) => t.order === tile.order + 1);
      if (leftSide && rightSide) {
        chowPair.push(leftSide, rightSide);
        chowTiles.push(chowPair);
      }
    }
    //リャンメン左処理
    const hasRightSides = countMap.has(tile.order + 1) && countMap.has(tile.order + 2);
    if (hasRightSides) {
      const chowPair: Tile[] = [];
      const right2 = this.tiles.find((t) => t.order === tile.order + 2);
      const right1 = this.tiles.find((t) => t.order === tile.order + 1);
      if (right2 && right1) {
        chowPair.push(right1, right2);
        chowTiles.push(chowPair);
      }
    }
    return chowTiles;
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
