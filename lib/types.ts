export interface Team {
  id: string
  name: string
  player1: string
  player2: string
}

export interface Match {
  id: string
  team1Id: string
  team2Id: string
  team1Games: number // Cambiado de team1Sets a team1Games
  team2Games: number // Cambiado de team2Sets a team2Games
  date: Date
}

export interface TeamStanding {
  id: string
  name: string
  played: number
  won: number
  lost: number
  gamesFor: number // Cambiado de setsFor a gamesFor
  gamesAgainst: number // Cambiado de setsAgainst a gamesAgainst
  points: number
}

