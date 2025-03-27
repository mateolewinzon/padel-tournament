"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { getStandings } from "@/lib/actions"
import type { TeamStanding } from "@/lib/types"

export default function StandingsTable() {
  const [standings, setStandings] = useState<TeamStanding[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true)
      try {
        const data = await getStandings()
        setStandings(data)
      } catch (error) {
        console.error("Error fetching standings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStandings()

    // Configurar un intervalo para actualizar la clasificación cada 30 segundos
    const intervalId = setInterval(fetchStandings, 30000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="bg-green-50 dark:bg-green-950">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Tabla de Clasificación
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Pareja</TableHead>
              <TableHead className="text-center">PJ</TableHead>
              <TableHead className="text-center">PG</TableHead>
              <TableHead className="text-center">PP</TableHead>
              <TableHead className="text-center">JF</TableHead>
              <TableHead className="text-center">JC</TableHead>
              <TableHead className="text-center">Puntos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Cargando clasificación...
                </TableCell>
              </TableRow>
            ) : standings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No hay datos de clasificación disponibles. Añade resultados para ver la tabla.
                </TableCell>
              </TableRow>
            ) : (
              standings.map((team, index) => (
                <TableRow key={team.id} className={index < 3 ? "bg-green-50/50 dark:bg-green-950/30" : ""}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="text-center">{team.played}</TableCell>
                  <TableCell className="text-center">{team.won}</TableCell>
                  <TableCell className="text-center">{team.lost}</TableCell>
                  <TableCell className="text-center">{team.gamesFor}</TableCell>
                  <TableCell className="text-center">{team.gamesAgainst}</TableCell>
                  <TableCell className="text-center font-bold">{team.points}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

