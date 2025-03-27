"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import type { Team, Match, TeamStanding } from "./types"

// Acciones para equipos
export async function getTeams(): Promise<Team[]> {
  try {
    const teams = await prisma.team.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return teams.map((team) => ({
      id: team.id,
      name: team.name,
      player1: team.player1,
      player2: team.player2,
    }))
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("No se pudieron obtener las parejas")
  }
}

export async function addTeam(data: { teamName: string; player1: string; player2: string }): Promise<Team> {
  try {
    const team = await prisma.team.create({
      data: {
        name: data.teamName,
        player1: data.player1,
        player2: data.player2,
      },
    })

    revalidatePath("/teams")
    revalidatePath("/")

    return {
      id: team.id,
      name: team.name,
      player1: team.player1,
      player2: team.player2,
    }
  } catch (error) {
    console.error("Error adding team:", error)
    throw new Error("No se pudo añadir la pareja")
  }
}

export async function removeTeam(teamId: string): Promise<void> {
  try {
    // Prisma eliminará automáticamente los partidos relacionados debido a la relación onDelete: Cascade
    await prisma.team.delete({
      where: {
        id: teamId,
      },
    })

    revalidatePath("/teams")
    revalidatePath("/")
  } catch (error) {
    console.error("Error removing team:", error)
    throw new Error("No se pudo eliminar la pareja")
  }
}

// Acciones para partidos
export async function addMatchResult(data: {
  team1Id: string
  team2Id: string
  team1Games: number
  team2Games: number
}): Promise<Match> {
  try {
    const match = await prisma.match.create({
      data: {
        team1Id: data.team1Id,
        team2Id: data.team2Id,
        team1Games: data.team1Games,
        team2Games: data.team2Games,
      },
    })

    revalidatePath("/")

    return {
      id: match.id,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
      team1Games: match.team1Games,
      team2Games: match.team2Games,
      date: match.date,
    }
  } catch (error) {
    console.error("Error adding match result:", error)
    throw new Error("No se pudo añadir el resultado del partido")
  }
}

// Acciones para clasificación
export async function getStandings(): Promise<TeamStanding[]> {
  try {
    // Obtener todos los equipos
    const teams = await prisma.team.findMany()

    // Obtener todos los partidos
    const matches = await prisma.match.findMany()

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
      if (standings[match.team1Id]) {
        standings[match.team1Id].played += 1
        standings[match.team1Id].gamesFor += match.team1Games
        standings[match.team1Id].gamesAgainst += match.team2Games

        if (match.team1Games > match.team2Games) {
          standings[match.team1Id].won += 1
          standings[match.team1Id].points += 3
        } else {
          standings[match.team1Id].lost += 1
        }
      }

      // Equipo 2
      if (standings[match.team2Id]) {
        standings[match.team2Id].played += 1
        standings[match.team2Id].gamesFor += match.team2Games
        standings[match.team2Id].gamesAgainst += match.team1Games

        if (match.team2Games > match.team1Games) {
          standings[match.team2Id].won += 1
          standings[match.team2Id].points += 3
        } else {
          standings[match.team2Id].lost += 1
        }
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
  } catch (error) {
    console.error("Error getting standings:", error)
    throw new Error("No se pudo obtener la clasificación")
  }
}

