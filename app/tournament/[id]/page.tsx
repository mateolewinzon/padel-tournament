import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import StandingsTable from "@/components/standings-table"
import AddResultForm from "@/components/add-result-form"
import { getIsAdmin } from "@/components/Protected"
import { getTournament, getTournamentImages } from "@/lib/actions"
import PastMatchesList from "@/components/past-matches-list"

export default async function TournamentPage({ params }: { params: { id: string } }) {
    const paramsData = await params
    const id = paramsData.id
    const tournament = await getTournament(id);
    const images = await getTournamentImages(id);
    const isAdmin = await getIsAdmin();
    if (!tournament) {
        return <div>Torneo no encontrado</div>;
    }
    console.log(images);
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">{tournament.nombre_torneo}</h1>

            {/* Image Carousel */}
            <div className="mb-8">
                <Carousel className="w-full max-w-4xl mx-auto">
                    <CarouselContent>
                        {images.map((imageUrl, index) => (
                            <CarouselItem key={index}>
                                <div className="aspect-video w-full">
                                    <img
                                        src={imageUrl}
                                        alt={`${tournament.nombre_torneo} - Image ${index + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>

            <Tabs defaultValue="standings" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="standings">Clasificación</TabsTrigger>
                    <TabsTrigger value="add-match">Partidos</TabsTrigger>
                    <TabsTrigger disabled={!isAdmin} value="add-result">Añadir Resultado</TabsTrigger>
                </TabsList>
                <TabsContent value="standings" className="mt-6">
                    <StandingsTable />
                </TabsContent>
                {isAdmin && (
                    <TabsContent value="add-result" className="mt-6">
                        <AddResultForm />
                    </TabsContent>
                )}
                <TabsContent value="add-match" className="mt-6">
                    <PastMatchesList tournamentId={id} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

