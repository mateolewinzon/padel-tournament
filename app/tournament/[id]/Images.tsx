import { Carousel, CarouselNext, CarouselItem, CarouselContent, CarouselPrevious } from "@/components/ui/carousel";
import { getTournamentImages } from "@/lib/actions";

export default async function Images({ tournamentId, tournamentName }: { tournamentId: string, tournamentName: string }) {
    const images = await getTournamentImages(tournamentId);
    return (

        <div className="mb-8">
            <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent>
                    {images.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                            <div className="aspect-video w-full">
                                <img
                                    src={imageUrl}
                                    alt={`${tournamentName} - Image ${index + 1}`}
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
    )
}