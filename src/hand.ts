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
}

export class OpenSet {
  tiles: Tile[];
  revealed: boolean;
  private constructor() {
    this.tiles = [];
    this.revealed = false;
  }
}
