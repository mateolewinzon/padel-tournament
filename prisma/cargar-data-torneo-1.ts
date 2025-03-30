//scirpt para cargar data de torneo 1

import { PrismaClient, Prisma } from "@prisma/client";

const data_players = [
  {
    id: 1,
    documento: "45235544",
    nombre: "Jaime",
    apellido: "Amigo",
  },
  {
    id: 2,
    documento: "45481066",
    nombre: "Gonzalo",
    apellido: "Álvarez Alonso",
  },
  {
    id: 3,
    documento: "45201662",
    nombre: "Gonzalo",
    apellido: "Baader",
  },
  {
    id: 4,
    documento: "45749688",
    nombre: "Alejo",
    apellido: "Leonoff",
  },
  {
    id: 5,
    documento: "45543577",
    nombre: "Ramiro",
    apellido: "Ibañez Carreras",
  },
  {
    id: 6,
    documento: "45683160",
    nombre: "Juan José",
    apellido: "Foiguel",
  },
  {
    id: 7,
    documento: "45201924",
    nombre: "Santiago",
    apellido: "Paternó",
  },
  {
    id: 8,
    documento: "45071710",
    nombre: "Máximo",
    apellido: "De la Vega",
  },
  {
    id: 9,
    documento: "45320679",
    nombre: "Mateo",
    apellido: "Lewinzon",
  },
  {
    id: 10,
    documento: "44546988",
    nombre: "Nicolás",
    apellido: "Wolodarsky",
  },
];

const data_parejas = [
  {
    id: 1,
    nombre_pareja: "La cola te pinto",
    id_jugador1: 1,
    id_jugador2: 2,
  },
  {
    id: 2,
    nombre_pareja: "Facu Esteban",
    id_jugador1: 3,
    id_jugador2: 5,
  },
  {
    id: 3,
    nombre_pareja: "Los pediatras",
    id_jugador1: 8,
    id_jugador2: 7,
  },
  {
    id: 4,
    nombre_pareja: "Alejo y un random",
    id_jugador1: 4,
    id_jugador2: 10,
  },
  {
    id: 5,
    nombre_pareja: "Pomeleros",
    id_jugador1: 9,
    id_jugador2: 6,
  },
];

const data_partidos = [
  {
    id: 4,
    nombre_pareja1: "La cola te pinto",
    nombre_pareja2: "Pomeleros",
    id_pareja1: 1,
    id_pareja2: 5,
    estado: "finalizado",
  },
  {
    id: 5,
    nombre_pareja1: "Facu Esteban",
    nombre_pareja2: "Los pediatras",
    id_pareja1: 2,
    id_pareja2: 3,
    estado: "finalizado",
  },
  {
    id: 7,
    nombre_pareja1: "Facu Esteban",
    nombre_pareja2: "La cola te pinto",
    id_pareja1: 2,
    id_pareja2: 1,
    estado: "finalizado",
  },
  {
    id: 8,
    nombre_pareja1: "Alejo y un random",
    nombre_pareja2: "Pomeleros",
    id_pareja1: 4,
    id_pareja2: 5,
    estado: "finalizado",
  },
  {
    id: 9,
    nombre_pareja1: "Facu Esteban",
    nombre_pareja2: "Pomeleros",
    id_pareja1: 2,
    id_pareja2: 5,
    estado: "finalizado",
  },
  {
    id: 10,
    nombre_pareja1: "Pomeleros",
    nombre_pareja2: "Los pediatras",
    id_pareja1: 5,
    id_pareja2: 3,
    estado: "finalizado",
  },
  {
    id: 11,
    nombre_pareja1: "La cola te pinto",
    nombre_pareja2: "Alejo y un random",
    id_pareja1: 1,
    id_pareja2: 4,
    estado: "finalizado",
  },
  {
    id: 12,
    nombre_pareja1: "Los pediatras",
    nombre_pareja2: "Alejo y un random",
    id_pareja1: 3,
    id_pareja2: 4,
    estado: "finalizado",
  },
  {
    id: 13,
    nombre_pareja1: "La cola te pinto",
    nombre_pareja2: "Los pediatras",
    id_pareja1: 1,
    id_pareja2: 3,
    estado: "finalizado",
  },
  {
    id: 14,
    nombre_pareja1: "Facu Esteban",
    nombre_pareja2: "Alejo y un random",
    id_pareja1: 2,
    id_pareja2: 4,
    estado: "finalizado",
  },
];

const data_resultados = [
  {
    id: 4,
    id_partido: 4,
    set_pareja1: 6,
    set_pareja2: 2,
    ganador: 1,
  },
  {
    id: 5,
    id_partido: 5,
    set_pareja1: 6,
    set_pareja2: 4,
    ganador: 2,
  },
  {
    id: 7,
    id_partido: 7,
    set_pareja1: 6,
    set_pareja2: 3,
    ganador: 2,
  },
  {
    id: 8,
    id_partido: 8,
    set_pareja1: 2,
    set_pareja2: 6,
    ganador: 5,
  },
  {
    id: 9,
    id_partido: 9,
    set_pareja1: 6,
    set_pareja2: 1,
    ganador: 2,
  },
  {
    id: 10,
    id_partido: 10,
    set_pareja1: 6,
    set_pareja2: 1,
    ganador: 5,
  },
  {
    id: 11,
    id_partido: 11,
    set_pareja1: 3,
    set_pareja2: 6,
    ganador: 4,
  },
  {
    id: 12,
    id_partido: 12,
    set_pareja1: 6,
    set_pareja2: 7,
    ganador: 4,
  },
  {
    id: 13,
    id_partido: 13,
    set_pareja1: 6,
    set_pareja2: 4,
    ganador: 1,
  },
  {
    id: 14,
    id_partido: 14,
    set_pareja1: 6,
    set_pareja2: 4,
    ganador: 2,
  },
];

async function main(trx: Prisma.TransactionClient) {
  await trx.jugador.createMany({
    data: data_players,
  });

  const torneo = await trx.torneo.create({
    data: {
      nombre_torneo: "La Horqueta Open",
      lugar: "La Horqueta",
      fecha: new Date("2025-03-29:21:00:00Z"),
      foto_url:
        "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    },
  });

  await trx.pareja.createMany({
    data: data_parejas,
  });

  await trx.torneo_pareja.createMany({
    data: data_parejas.map((pareja) => ({
      id: 100 + pareja.id,
      id_torneo: torneo.id,
      id_pareja: pareja.id,
    })),
  });

  await trx.partido.createMany({
    data: data_partidos.map((partido) => ({
      id: partido.id,
      id_torneo: torneo.id,
      id_pareja1: 100 + partido.id_pareja1,
      id_pareja2: 100 + partido.id_pareja2,
      estado: partido.estado,
    })),
  });

  await trx.resultado.createMany({
    data: data_resultados,
  });
}

async function run() {
  const prisma = new PrismaClient();
  await prisma.$transaction(async (trx) => {
    await main(trx);
  });
}

run();

export {};
