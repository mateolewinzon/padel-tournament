"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import { TeamStanding } from "./types";

// Update types to match new schema
interface Team {
  id: string;
  name: string;
  player1Dni: string;
  player2Dni: string;
}

interface Match {
  id: number;
  pair1Name: string;
  pair2Name: string;
  setPair1?: number;
  setPair2?: number;
  status: string;
  winner?: string;
}

export async function getTeams(): Promise<Team[]> {
  try {
    const pairs = await prisma.pareja.findMany({
      orderBy: {
        nombre_pareja: "asc",
      },
      include: {
        jugador_pareja_dni_jugador1Tojugador: true,
        jugador_pareja_dni_jugador2Tojugador: true,
      },
    })

    return pairs.map((pair) => ({
      id: pair.nombre_pareja,
      name: pair.nombre_pareja,
      player1Dni: pair.dni_jugador1,
      player2Dni: pair.dni_jugador2,
      player1: `${pair.jugador_pareja_dni_jugador1Tojugador.nombre} ${pair.jugador_pareja_dni_jugador1Tojugador.apellido}`,
      player2: `${pair.jugador_pareja_dni_jugador2Tojugador.nombre} ${pair.jugador_pareja_dni_jugador2Tojugador.apellido}`,
    }))
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("No se pudieron obtener las parejas")
  }
}
export async function addTeam(data: { 
  teamName: string; 
  player1Dni: string; 
  player2Dni: string 
}): Promise<Team> {
  try {
    // Verify players exist
    const player1 = await prisma.jugador.findUnique({ where: { dni: data.player1Dni } })
    const player2 = await prisma.jugador.findUnique({ where: { dni: data.player2Dni } })
    
    if (!player1 || !player2) {
      throw new Error("Uno o ambos jugadores no existen")
    }

    const pair = await prisma.pareja.create({
      data: {
        nombre_pareja: data.teamName,
        dni_jugador1: data.player1Dni,
        dni_jugador2: data.player2Dni,
      },
    })

    revalidatePath("/teams")
    revalidatePath("/")

    return {
      id: pair.nombre_pareja,
      name: pair.nombre_pareja,
      player1Dni: pair.dni_jugador1,
      player2Dni: pair.dni_jugador2,
    }
  } catch (error) {
    console.error("Error adding team:", error)
    throw new Error("No se pudo añadir la pareja")
  }
}

export async function removeTeam(teamName: string): Promise<void> {
  try {
    // Note: Related matches won't be automatically deleted due to NoAction constraint
    // You might want to delete related matches first if needed
    await prisma.pareja.delete({
      where: {
        nombre_pareja: teamName,
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
  pair1Name: string
  pair2Name: string
  setPair1: number
  setPair2: number
}): Promise<Match> {
  try {
    console.log("Received data:", data);

    // Validate input
    if (!data.pair1Name) throw new Error("pair1Name es requerido");
    if (!data.pair2Name) throw new Error("pair2Name es requerido");
    if (data.setPair1 === undefined || data.setPair1 === null) throw new Error("setPair1 es requerido");
    if (data.setPair2 === undefined || data.setPair2 === null) throw new Error("setPair2 es requerido");

    // Check if pairs exist
    const pair1 = await prisma.pareja.findUnique({
      where: { nombre_pareja: data.pair1Name }
    });
    const pair2 = await prisma.pareja.findUnique({
      where: { nombre_pareja: data.pair2Name }
    });

    if (!pair1) throw new Error(`La pareja ${data.pair1Name} no existe`);
    if (!pair2) throw new Error(`La pareja ${data.pair2Name} no existe`);

    console.log("Creating match with pairs:", {
      pair1: data.pair1Name,
      pair2: data.pair2Name
    });

    // Create the match and its result
    const match = await prisma.partido.create({
      data: {
        nombre_pareja1: data.pair1Name,
        nombre_pareja2: data.pair2Name,
        estado: "finalizado",
        resultado: {
          create: {
            set_pareja1: data.setPair1,
            set_pareja2: data.setPair2,
            ganador: data.setPair1 > data.setPair2 ? data.pair1Name : data.pair2Name,
          },
        },
      },
      include: {
        resultado: true,
      },
    });

    console.log("Match created:", match);

    revalidatePath("/");

    return {
      id: match.id_partido,
      pair1Name: match.nombre_pareja1,
      pair2Name: match.nombre_pareja2,
      setPair1: match.resultado?.set_pareja1 ?? undefined,
      setPair2: match.resultado?.set_pareja2?? undefined,
      status: match.estado ?? "unknown",
      winner: match.resultado?.ganador ?? "unknown",
    };
  } catch (error) {
    console.error("Error adding match result:", error);
    throw new Error("No se pudo añadir el resultado del partido");
  }
}

export async function getStandings(): Promise<TeamStanding[]> {
  try {
    // Get all pairs (parejas) instead of teams
    const pairs = await prisma.pareja.findMany();

    // Get all matches with their results
    const matches = await prisma.partido.findMany({
      include: {
        resultado: true
      },
      where: {
        estado: "finalizado" // Only consider finished matches
      }
    });

    // Initialize standings for each pair
    const standings: Record<string, TeamStanding> = {};

    // Initialize all pairs in standings
    pairs.forEach((pair) => {
      standings[pair.nombre_pareja] = {
        id: pair.nombre_pareja,
        name: pair.nombre_pareja,
        played: 0,
        won: 0,
        lost: 0,
        gamesFor: 0,
        gamesAgainst: 0,
        points: 0,
      };
    });

    // Calculate statistics based on matches and results
    matches.forEach((match) => {
      if (!match.resultado) return; // Skip if no result

      const pair1 = standings[match.nombre_pareja1];
      const pair2 = standings[match.nombre_pareja2];

      if (pair1 && pair2 && match.resultado.set_pareja1 !== null && match.resultado.set_pareja2 !== null) {
        // Update pair 1 stats
        pair1.played += 1;
        pair1.gamesFor += match.resultado.set_pareja1;
        pair1.gamesAgainst += match.resultado.set_pareja2;

        // Update pair 2 stats
        pair2.played += 1;
        pair2.gamesFor += match.resultado.set_pareja2;
        pair2.gamesAgainst += match.resultado.set_pareja1;

        // Determine winner and update points
        if (match.resultado.set_pareja1 > match.resultado.set_pareja2) {
          pair1.won += 1;
          pair1.points += 3;
          pair2.lost += 1;
        } else {
          pair2.won += 1;
          pair2.points += 3;
          pair1.lost += 1;
        }
      }
    });

    // Convert to array and sort by points (descending)
    return Object.values(standings).sort((a, b) => {
      // Sort by points first
      if (b.points !== a.points) return b.points - a.points;

      // If tied on points, sort by game difference
      const aDiff = a.gamesFor - a.gamesAgainst;
      const bDiff = b.gamesFor - b.gamesAgainst;
      if (bDiff !== aDiff) return bDiff - aDiff;

      // If still tied, sort by games for
      return b.gamesFor - a.gamesFor;
    });
  } catch (error) {
    console.error("Error getting standings:", error);
    throw new Error("No se pudo obtener la clasificación");
  }
}