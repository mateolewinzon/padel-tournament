"use server"

import { revalidatePath } from "next/cache"
import prisma from "./prisma"
import { TeamStanding } from "./types";


export async function getTeams() {
  try {
    return await prisma.pareja.findMany({
      orderBy: {
        nombre_pareja: "asc",
      },
      include: {
        jugador1: true,
        jugador2: true,
      },
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("No se pudieron obtener las parejas");
  }
}
// export async function addTeam(data: {
//   teamName: string;
//   player1Dni: string;
//   player2Dni: string
// }){
//   try {
//     const pair = await prisma.pareja.create({
//       data: {
//         nombre_pareja: data.teamName,
//         jugador1:{
//             create:{
//               documento: data.player1Dni,
//               nombre: data.player1Nombre,
//               apellido: data.player1Apellido,
//             }
//         },
//         jugador2:{
//           create:{
//             documento: data.player2Dni,
//             nombre: data.player2Nombre,
//             apellido: data.player2Apellido,
//           }
//     })

//     revalidatePath("/teams")
//     revalidatePath("/")

//     return {
//       id: pair.nombre_pareja,
//       name: pair.nombre_pareja,
//       player1Dni: pair.dni_jugador1,
//       player2Dni: pair.dni_jugador2,
//     }
//   } catch (error) {
//     console.error("Error adding team:", error)
//     throw new Error("No se pudo añadir la pareja")
//   }
// }

// export async function removeTeam(teamName: string): Promise<void> {
//   try {
//     // Note: Related matches won't be automatically deleted due to NoAction constraint
//     // You might want to delete related matches first if needed
//     await prisma.pareja.delete({
//       where: {
//         nombre_pareja: teamName,
//       },
//     })

//     revalidatePath("/teams")
//     revalidatePath("/")
//   } catch (error) {
//     console.error("Error removing team:", error)
//     throw new Error("No se pudo eliminar la pareja")
//   }
// }

// Acciones para partidos
export async function addMatchResult(data: {
  pair1Id: number;
  pair2Id: number;
  setPair1: number;
  setPair2: number;
}) {
  try {
    console.log("Received data:", data);

    // Validate input
    if (!data.pair1Id) throw new Error("pair1Id es requerido");
    if (!data.pair2Id) throw new Error("pair2Id es requerido");
    if (data.setPair1 === undefined || data.setPair1 === null)
      throw new Error("setPair1 es requerido");
    if (data.setPair2 === undefined || data.setPair2 === null)
      throw new Error("setPair2 es requerido");

    // Check if pairs exist
    const pair1 = await prisma.pareja.findUnique({
      where: { id: data.pair1Id },
    });
    const pair2 = await prisma.pareja.findUnique({
      where: { id: data.pair2Id },
    });

    if (!pair1) throw new Error(`La pareja ${data.pair1Id} no existe`);
    if (!pair2) throw new Error(`La pareja ${data.pair2Id} no existe`);

    // Create the match and its result
    const match = await prisma.partido.create({
      data: {
        id_torneo: 1,
        id_pareja1: data.pair1Id,
        id_pareja2: data.pair2Id,
        estado: "finalizado",
        resultado: {
          create: {
            set_pareja1: data.setPair1,
            set_pareja2: data.setPair2,
            ganador:
              data.setPair1 > data.setPair2 ? data.pair1Id : data.pair2Id,
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
      id: match.id,
      pair1Name: pair1.nombre_pareja,
      pair2Name: pair2.nombre_pareja,
      setPair1: match.resultado?.set_pareja1 ?? undefined,
      setPair2: match.resultado?.set_pareja2 ?? undefined,
      status: match.estado ?? "unknown",
      winner: match.resultado?.ganador ?? "unknown",
    };
  } catch (error) {
    console.error("Error adding match result:", error);
    throw new Error("No se pudo añadir el resultado del partido");
  }
}

export async function getStandings(tournamentId = 7): Promise<TeamStanding[]> {
  try {
    // Get all pairs (parejas) instead of teams
    const pairs = await prisma.torneo_pareja.findMany({
      where: {
        id_torneo: tournamentId,
      },
      include: {
        pareja: true,
      },
    });

    // Get all matches with their results
    const matches = await prisma.partido.findMany({
      include: {
        resultado: true,
      },
      where: {
        estado: "finalizado", // Only consider finished matches
      },
    });

    console.log("Pairs:", pairs);

    // Initialize standings for each pair
    const standings: Record<string, TeamStanding> = {};

    // Initialize all pairs in standings
    pairs.forEach((pair) => {
      const idPareja = pair.id;
      standings[idPareja] = {
        id: idPareja.toString(),
        name: pair.pareja.nombre_pareja,
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

      const pair1 = standings[match.id_pareja1];
      const pair2 = standings[match.id_pareja2];

      if (
        pair1 &&
        pair2 &&
        match.resultado.set_pareja1 !== null &&
        match.resultado.set_pareja2 !== null
      ) {
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

export async function getPastMatches() {
  const matches = await prisma.partido.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      id_pareja1: true,
      id_pareja2: true,
      resultado: {
        select: {
          set_pareja1: true,
          set_pareja2: true,
          ganador: true,
        },
      },
    },
  });
  return matches;
}