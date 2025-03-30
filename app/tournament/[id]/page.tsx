import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import StandingsTable from "@/components/standings-table"
import { getTournament } from "@/lib/actions"
import PastMatchesList from "@/components/past-matches-list"
import Images from "./Images"
import { Suspense } from "react"
import AddResult from "./AddResult"
import AddResultButton from "./AddResultButton"

export default async function TournamentPage({ params }: { params: { id: string } }) {
    const paramsData = await params
    const id = paramsData.id
    const tournament = await getTournament(id);

    if (!tournament) {
        return <div>Torneo no encontrado</div>;
    }

    return (
        <div className="flex flex-col container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">{tournament.nombre_torneo}</h1>
            <Suspense>
                <Images tournamentId={id} tournamentName={tournament.nombre_torneo} />
            </Suspense>
            <Tabs defaultValue="standings" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="standings">Clasificación</TabsTrigger>
                    <TabsTrigger value="add-match">Partidos</TabsTrigger>
                    <Suspense fallback={<TabsTrigger disabled value="add-result">Añadir Resultado</TabsTrigger>}>
                        <AddResultButton />
                    </Suspense>
                </TabsList>
                <TabsContent value="standings" className="mt-6">
                    <StandingsTable />
                </TabsContent>
                    <TabsContent value="add-result" className="mt-6">
                    <Suspense fallback={<div>Cargando...</div>}>
                        <AddResult />
                    </Suspense>
                </TabsContent>
                <TabsContent value="add-match" className="mt-6">
                    <PastMatchesList tournamentId={id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

