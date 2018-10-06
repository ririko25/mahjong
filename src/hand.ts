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
}

export class OpenSet {
  tiles: Tile[];
  revealed: boolean;
}
