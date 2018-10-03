import { Tile } from "./tile";

export class Hand {
  tiles: Tile[];
  opensets: OpenSet[];
  constructor(hand: Tile[]) {
    this.tiles = hand;
    this.opensets = [];
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
