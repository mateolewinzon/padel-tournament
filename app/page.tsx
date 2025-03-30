import Link from "next/link";
import { getTournaments } from "@/lib/actions";

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Torneos</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <Link
            key={tournament.id}
            href={`/tournament/${tournament.id}`}
            className="block p-1 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="aspect-video">
              <img
                src={tournament.foto_url}
                alt={tournament.nombre_torneo}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="p-3">
            <h2 className="text-xl font-semibold mb-2">{tournament.nombre_torneo}</h2>
            <p className="mb-2">{tournament.lugar}</p>
            <p className="">
              {new Date(tournament.fecha).toLocaleDateString()}
              </p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
