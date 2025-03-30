export interface TeamStanding {
  id: string;
  name: string;
  played: number;
  won: number;
  lost: number;
  gamesFor: number; // Cambiado de setsFor a gamesFor
  gamesAgainst: number; // Cambiado de setsAgainst a gamesAgainst
  points: number;
}
