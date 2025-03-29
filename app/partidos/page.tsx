import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PastMatchesList from "@/components/past-matches-list" // Asegúrate de crear este componente

export default function MatchPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Historial de Partidos</h1>

      <Tabs defaultValue="list" className="w-full max-w-4xl mx-auto">
      <PastMatchesList />
      </Tabs>
    </div>
  )
}