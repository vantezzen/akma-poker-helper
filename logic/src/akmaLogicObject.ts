export interface AkmaLogicObject {
  player: Player[];
}

export interface Player {
  name: string;
  ranks: Rank[];
  pokerScore: number;
  isWinner: boolean;
}

export interface Rank {
  name: string;
  percentage: number;
}
