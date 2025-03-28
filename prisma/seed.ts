import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Obtener todos los jugadores existentes
  const jugadores = await prisma.jugador.findMany()

  if (jugadores.length === 0) {
    throw new Error("No hay jugadores en la base de datos")
  }
  console.log(`Encontrados ${jugadores.length} jugadores`)

  // Obtener todas las parejas existentes
  const parejas = await prisma.pareja.findMany()
  if (parejas.length === 0) {
    throw new Error("No hay parejas en la base de datos")
  }
  console.log(`Encontradas ${parejas.length} parejas`)

  // Obtener todos los partidos existentes
  const partidos = await prisma.partido.findMany()
  
  console.log(`Encontrados ${partidos.length} partidos`)
  
  // Mostrar la información recuperada
  console.log("\nJugadores:")
  jugadores.forEach(j => {
    console.log(`- ${j.nombre} ${j.apellido} (DNI: ${j.dni})`)
  })

  console.log("\nParejas:")
  parejas.forEach(p => {
    console.log(`- ${p.nombre_pareja} (Jugador1: ${p.dni_jugador1}, Jugador2: ${p.dni_jugador2})`)
  })

  console.log("\nPartidos:")
  partidos.forEach(p => {
    const resultado = p.resultado
    console.log(`- Partido ${p.id_partido}: ${p.nombre_pareja1} vs ${p.nombre_pareja2}`)
    console.log(`  Estado: ${p.estado}`)
    if (resultado) {
      console.log(`  Resultado: ${resultado.set_pareja1}-${resultado.set_pareja2}`)
      console.log(`  Ganador: ${resultado.ganador || "No definido"}`)
    }
  })

}

main()
  .catch((e) => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })