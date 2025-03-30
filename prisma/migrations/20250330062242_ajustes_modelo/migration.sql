/*
  Warnings:

  - The primary key for the `jugador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dni` on the `jugador` table. All the data in the column will be lost.
  - The primary key for the `pareja` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dni_jugador1` on the `pareja` table. All the data in the column will be lost.
  - You are about to drop the column `dni_jugador2` on the `pareja` table. All the data in the column will be lost.
  - The primary key for the `partido` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_partido` on the `partido` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_pareja1` on the `partido` table. All the data in the column will be lost.
  - You are about to drop the column `nombre_pareja2` on the `partido` table. All the data in the column will be lost.
  - The primary key for the `resultado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_resultado` on the `resultado` table. All the data in the column will be lost.
  - The `ganador` column on the `resultado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `torneo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_torneo` on the `torneo` table. All the data in the column will be lost.
  - The primary key for the `torneo_pareja` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nombre_pareja` on the `torneo_pareja` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre_pareja]` on the table `pareja` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_torneo,id_pareja]` on the table `torneo_pareja` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `documento` to the `jugador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_jugador1` to the `pareja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_jugador2` to the `pareja` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pareja1` to the `partido` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pareja2` to the `partido` table without a default value. This is not possible if the table is not empty.
  - Made the column `id_torneo` on table `partido` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `foto_url` to the `torneo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lugar` to the `torneo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_pareja` to the `torneo_pareja` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pareja" DROP CONSTRAINT "pareja_dni_jugador1_fkey";

-- DropForeignKey
ALTER TABLE "pareja" DROP CONSTRAINT "pareja_dni_jugador2_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_id_torneo_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_nombre_pareja1_fkey";

-- DropForeignKey
ALTER TABLE "partido" DROP CONSTRAINT "partido_nombre_pareja2_fkey";

-- DropForeignKey
ALTER TABLE "resultado" DROP CONSTRAINT "resultado_ganador_fkey";

-- DropForeignKey
ALTER TABLE "resultado" DROP CONSTRAINT "resultado_id_partido_fkey";

-- DropForeignKey
ALTER TABLE "torneo_pareja" DROP CONSTRAINT "torneo_pareja_id_torneo_fkey";

-- DropForeignKey
ALTER TABLE "torneo_pareja" DROP CONSTRAINT "torneo_pareja_nombre_pareja_fkey";

-- AlterTable
ALTER TABLE "jugador" DROP CONSTRAINT "jugador_pkey",
DROP COLUMN "dni",
ADD COLUMN     "documento" VARCHAR(20) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "jugador_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pareja" DROP CONSTRAINT "pareja_pkey",
DROP COLUMN "dni_jugador1",
DROP COLUMN "dni_jugador2",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "id_jugador1" INTEGER NOT NULL,
ADD COLUMN     "id_jugador2" INTEGER NOT NULL,
ADD CONSTRAINT "pareja_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "partido" DROP CONSTRAINT "partido_pkey",
DROP COLUMN "id_partido",
DROP COLUMN "nombre_pareja1",
DROP COLUMN "nombre_pareja2",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "id_pareja1" INTEGER NOT NULL,
ADD COLUMN     "id_pareja2" INTEGER NOT NULL,
ALTER COLUMN "id_torneo" SET NOT NULL,
ADD CONSTRAINT "partido_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "resultado" DROP CONSTRAINT "resultado_pkey",
DROP COLUMN "id_resultado",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "ganador",
ADD COLUMN     "ganador" INTEGER,
ADD CONSTRAINT "resultado_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "torneo" DROP CONSTRAINT "torneo_pkey",
DROP COLUMN "id_torneo",
ADD COLUMN     "foto_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "lugar" VARCHAR(50) NOT NULL,
ADD CONSTRAINT "torneo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "torneo_pareja" DROP CONSTRAINT "torneo_pareja_pkey",
DROP COLUMN "nombre_pareja",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "id_pareja" INTEGER NOT NULL,
ADD CONSTRAINT "torneo_pareja_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "pareja_nombre_pareja_key" ON "pareja"("nombre_pareja");

-- CreateIndex
CREATE UNIQUE INDEX "torneo_pareja_id_torneo_id_pareja_key" ON "torneo_pareja"("id_torneo", "id_pareja");

-- AddForeignKey
ALTER TABLE "pareja" ADD CONSTRAINT "pareja_id_jugador1_fkey" FOREIGN KEY ("id_jugador1") REFERENCES "jugador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pareja" ADD CONSTRAINT "pareja_id_jugador2_fkey" FOREIGN KEY ("id_jugador2") REFERENCES "jugador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_id_pareja1_fkey" FOREIGN KEY ("id_pareja1") REFERENCES "torneo_pareja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_id_pareja2_fkey" FOREIGN KEY ("id_pareja2") REFERENCES "torneo_pareja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "partido"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "torneo_pareja" ADD CONSTRAINT "torneo_pareja_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "torneo_pareja" ADD CONSTRAINT "torneo_pareja_id_pareja_fkey" FOREIGN KEY ("id_pareja") REFERENCES "pareja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
