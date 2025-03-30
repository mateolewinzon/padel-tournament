-- CreateTable
CREATE TABLE "jugador" (
    "dni" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,

    CONSTRAINT "jugador_pkey" PRIMARY KEY ("dni")
);

-- CreateTable
CREATE TABLE "pareja" (
    "nombre_pareja" VARCHAR(50) NOT NULL,
    "dni_jugador1" VARCHAR(20) NOT NULL,
    "dni_jugador2" VARCHAR(20) NOT NULL,

    CONSTRAINT "pareja_pkey" PRIMARY KEY ("nombre_pareja")
);

-- CreateTable
CREATE TABLE "partido" (
    "id_partido" SERIAL NOT NULL,
    "nombre_pareja1" VARCHAR(50) NOT NULL,
    "nombre_pareja2" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(20) DEFAULT 'programado',
    "id_torneo" INTEGER,

    CONSTRAINT "partido_pkey" PRIMARY KEY ("id_partido")
);

-- CreateTable
CREATE TABLE "resultado" (
    "id_resultado" SERIAL NOT NULL,
    "id_partido" INTEGER NOT NULL,
    "set_pareja1" INTEGER,
    "set_pareja2" INTEGER,
    "ganador" VARCHAR(50),

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "torneo_pareja" (
    "id_torneo" INTEGER NOT NULL,
    "nombre_pareja" TEXT NOT NULL,

    CONSTRAINT "torneo_pareja_pkey" PRIMARY KEY ("id_torneo","nombre_pareja")
);

-- CreateTable
CREATE TABLE "torneo" (
    "id_torneo" SERIAL NOT NULL,
    "nombre_torneo" VARCHAR(50) NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "torneo_pkey" PRIMARY KEY ("id_torneo")
);

-- CreateIndex
CREATE UNIQUE INDEX "resultado_id_partido_key" ON "resultado"("id_partido");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- AddForeignKey
ALTER TABLE "pareja" ADD CONSTRAINT "pareja_dni_jugador1_fkey" FOREIGN KEY ("dni_jugador1") REFERENCES "jugador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pareja" ADD CONSTRAINT "pareja_dni_jugador2_fkey" FOREIGN KEY ("dni_jugador2") REFERENCES "jugador"("dni") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_nombre_pareja1_fkey" FOREIGN KEY ("nombre_pareja1") REFERENCES "pareja"("nombre_pareja") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_nombre_pareja2_fkey" FOREIGN KEY ("nombre_pareja2") REFERENCES "pareja"("nombre_pareja") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partido" ADD CONSTRAINT "partido_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneo"("id_torneo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_ganador_fkey" FOREIGN KEY ("ganador") REFERENCES "pareja"("nombre_pareja") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_partido_fkey" FOREIGN KEY ("id_partido") REFERENCES "partido"("id_partido") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "torneo_pareja" ADD CONSTRAINT "torneo_pareja_id_torneo_fkey" FOREIGN KEY ("id_torneo") REFERENCES "torneo"("id_torneo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "torneo_pareja" ADD CONSTRAINT "torneo_pareja_nombre_pareja_fkey" FOREIGN KEY ("nombre_pareja") REFERENCES "pareja"("nombre_pareja") ON DELETE NO ACTION ON UPDATE NO ACTION;
