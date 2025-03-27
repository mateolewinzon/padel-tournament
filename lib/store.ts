import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Team, Match, TeamStanding } from "./types"

interface PadelStore {
  teams: Team[]
  matches: Match[]

  // Acciones para equipos
  addTeam: (data: { teamName: string; player1: string; player2: string }) => Team
  getTeams: () => Team[]
  removeTeam: (teamId: string) => void

  // Acciones para partidos
  addMatchResult: (data: { team1Id: string; team2Id: string; team1Games: number; team2Games: number }) => Match

  // Acciones para clasificación
  getStandings: () => TeamStanding[]
}

export const usePadelStore = create<PadelStore>()(
  persist(
    (set, get) => ({
      teams: [
        { id: "1", name: "Los Campeones", player1: "Juan Pérez", player2: "Ana García" },
        { id: "2", name: "Raquetas de Fuego", player1: "Carlos López", player2: "María Rodríguez" },
        { id: "3", name: "Dúo Dinámico", player1: "Pedro Sánchez", player2: "Laura Martínez" },
        { id: "4", name: "Pádel Masters", player1: "Miguel Fernández", player2: "Sofía González" },
      ],
      matches: [
        { id: "1", team1Id: "1", team2Id: "2", team1Games: 6, team2Games: 3, date: new Date() },
        { id: "2", team1Id: "3", team2Id: "4", team1Games: 4, team2Games: 6, date: new Date() },
        { id: "3", team1Id: "1", team2Id: "3", team1Games: 6, team2Games: 4, date: new Date() },
      ],

      // Acciones para equipos
      addTeam: (data) => {
        const newTeam: Team = {
          id: uuidv4(),
          name: data.teamName,
          player1: data.player1,
          player2: data.player2,
        }

        set((state) => ({
          teams: [...state.teams, newTeam],
        }))

        return newTeam
      },

      getTeams: () => {
        return get().teams
      },

      removeTeam: (teamId) => {
        // Eliminar el equipo
        set((state) => {
          // Crear nuevos arrays para asegurar que Zustand detecte el cambio
          const updatedTeams = state.teams.filter((team) => team.id !== teamId)
          const updatedMatches = state.matches.filter((match) => match.team1Id !== teamId && match.team2Id !== teamId)

          return {
            teams: updatedTeams,
            matches: updatedMatches,
          }
        })
      },

      // Acciones para partidos
      addMatchResult: (data) => {
        const newMatch: Match = {
          id: uuidv4(),
          team1Id: data.team1Id,
          team2Id: data.team2Id,
          team1Games: data.team1Games,
          team2Games: data.team2Games,
          date: new Date(),
        }

        set((state) => ({
          matches: [...state.matches, newMatch],
        }))

        return newMatch
      },

      // Acciones para clasificación
      getStandings: () => {
        const { teams, matches } = get()

        // Inicializamos las estadísticas para cada equipo
        const standings: Record<string, TeamStanding> = {}

        // Aseguramos que todos los equipos estén en la clasificación
        teams.forEach((team) => {
          standings[team.id] = {
            id: team.id,
            name: team.name,
            played: 0,
            won: 0,
            lost: 0,
            gamesFor: 0,
            gamesAgainst: 0,
            points: 0,
          }
        })

        // Calculamos las estadísticas basadas en los partidos
        matches.forEach((match) => {
          // Equipo 1
          if (!standings[match.team1Id]) {
            const team = teams.find((t) => t.id === match.team1Id)
            if (!team) return

            standings[match.team1Id] = {
              id: team.id,
              name: team.name,
              played: 0,
              won: 0,
              lost: 0,
              gamesFor: 0,
              gamesAgainst: 0,
              points: 0,
            }
          }

          // Equipo 2
          if (!standings[match.team2Id]) {
            const team = teams.find((t) => t.id === match.team2Id)
            if (!team) return

            standings[match.team2Id] = {
              id: team.id,
              name: team.name,
              played: 0,
              won: 0,
              lost: 0,
              gamesFor: 0,
              gamesAgainst: 0,
              points: 0,
            }
          }

          // Actualizamos estadísticas del equipo 1
          standings[match.team1Id].played += 1
          standings[match.team1Id].gamesFor += match.team1Games
          standings[match.team1Id].gamesAgainst += match.team2Games

          // Actualizamos estadísticas del equipo 2
          standings[match.team2Id].played += 1
          standings[match.team2Id].gamesFor += match.team2Games
          standings[match.team2Id].gamesAgainst += match.team1Games

          // Determinamos ganador y perdedor
          if (match.team1Games > match.team2Games) {
            standings[match.team1Id].won += 1
            standings[match.team2Id].lost += 1
            standings[match.team1Id].points += 3
          } else {
            standings[match.team2Id].won += 1
            standings[match.team1Id].lost += 1
            standings[match.team2Id].points += 3
          }
        })

        // Convertimos el objeto a un array y ordenamos por puntos (descendente)
        return Object.values(standings).sort((a, b) => {
          // Primero por puntos
          if (b.points !== a.points) return b.points - a.points

          // Si hay empate a puntos, por diferencia de juegos
          const aDiff = a.gamesFor - a.gamesAgainst
          const bDiff = b.gamesFor - b.gamesAgainst
          if (bDiff !== aDiff) return bDiff - aDiff

          // Si sigue habiendo empate, por juegos a favor
          return b.gamesFor - a.gamesFor
        })
      },
    }),
    {
      name: "padel-tournament-storage", // nombre para localStorage
      partialize: (state) => ({
        teams: state.teams,
        matches: state.matches.map((match) => ({
          ...match,
          date: match.date instanceof Date ? match.date.toISOString() : match.date,
        })),
      }),
      // Convertir las fechas de string a Date al cargar desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.matches = state.matches.map((match) => ({
            ...match,
            date: new Date(match.date),
          }))
        }
      },
    },
  ),
)

