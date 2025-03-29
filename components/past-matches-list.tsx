// components/past-matches-list.tsx
import { getPastMatches } from "@/lib/actions"

export default async function PastMatchesList() {
  const matches = await getPastMatches()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Partidos terminados</h2>
      {matches.length === 0 ? (
        <p>No hay partidos pasados registrados.</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((match) => {
            // Determina el ganador y el perdedor
            const isPareja1Winner = match.resultado?.ganador === match.nombre_pareja1
            const isPareja2Winner = match.resultado?.ganador === match.nombre_pareja2

            return (
              <li key={match.id_partido} className="border p-4 rounded-md">
                <p>
                  <strong
                    className={
                      isPareja1Winner
                        ? "text-green-500"
                        : isPareja2Winner
                        ? "text-red-500"
                        : "text-gray-700"
                    }
                  >
                    {match.nombre_pareja1}
                  </strong>{" "}
                  vs{" "}
                  <strong
                    className={
                      isPareja2Winner
                        ? "text-green-500"
                        : isPareja1Winner
                        ? "text-red-500"
                        : "text-gray-700"
                    }
                  >
                    {match.nombre_pareja2}
                  </strong>
                </p>
                <p>
                  Resultado:{" "}
                  {match.resultado
                    ? `${match.resultado.set_pareja1 || 0} - ${match.resultado.set_pareja2 || 0}`
                    : "No disponible"}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}