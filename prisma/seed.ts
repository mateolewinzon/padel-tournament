import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Limpiar la base de datos
  await prisma.match.deleteMany({})
  await prisma.team.deleteMany({})

  // Crear equipos
  const team1 = await prisma.team.create({
    data: {
      name: "Los Campeones",
      player1: "Juan Pérez",
      player2: "Ana García",
    },
  })

  const team2 = await prisma.team.create({
    data: {
      name: "Raquetas de Fuego",
      player1: "Carlos López",
      player2: "María Rodríguez",
    },
  })

  const team3 = await prisma.team.create({
    data: {
      name: "Dúo Dinámico",
      player1: "Pedro Sánchez",
      player2: "Laura Martínez",
    },
  })

  const team4 = await prisma.team.create({
    data: {
      name: "Pádel Masters",
      player1: "Miguel Fernández",
      player2: "Sofía González",
    },
  })

  // Crear partidos
  await prisma.match.create({
    data: {
      team1Id: team1.id,
      team2Id: team2.id,
      team1Games: 6,
      team2Games: 3,
    },
  })

  await prisma.match.create({
    data: {
      team1Id: team3.id,
      team2Id: team4.id,
      team1Games: 4,
      team2Games: 6,
    },
  })

  await prisma.match.create({
    data: {
      team1Id: team1.id,
      team2Id: team3.id,
      team1Games: 6,
      team2Games: 4,
    },
  })

  console.log("Base de datos sembrada correctamente")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

