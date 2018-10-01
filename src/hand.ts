import { Tile } from "./tile";

export class Hand {
  tiles: Tile[];
  opensets: OpenSet[];
  constructor(hand: Tile[]) {
    this.tiles = hand;
    this.opensets = [];
  }
}

export class OpenSet {
  tiles: Tile[];
  revealed: boolean;
}
